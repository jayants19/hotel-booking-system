from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
from typing import List
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Database Connection
def create_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Jayy",
            database="hotel_booking"
        )
        return conn
    except Exception as e:
        print("❌ Database Connection Failed:", str(e))
        return None

#  Pydantic Model
class Booking(BaseModel):
    name: str
    phone: str
    email: str
    checkin: datetime
    checkout: datetime
    guests: int = 1
    room: str
    price: float

#  Route to Add a Booking
@app.post("/bookings")
async def add_booking(booking: Booking):
    db = create_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = db.cursor(dictionary=True)
    try:
        # Check if guest already exists (by email or phone)
        cursor.execute("SELECT guest_id FROM guests WHERE email = %s OR number = %s", (booking.email, booking.phone))
        guest = cursor.fetchone()

        if guest:
            guest_id = guest['guest_id']
        else:
            # Insert new guest
            cursor.execute(
                "INSERT INTO guests (name, number, email) VALUES (%s, %s, %s)",
                (booking.name, booking.phone, booking.email)
            )
            db.commit()
            guest_id = cursor.lastrowid  # Get new guest_id
        nights = (booking.checkout - booking.checkin).days
        if nights <= 0:
          raise HTTPException(status_code=400, detail="Checkout date must be after checkin date")
        total_price = nights * booking.price
        # Insert booking linked with guest_id
        cursor.execute(
            """INSERT INTO bookings_data (checkin, checkout, guests, room_type, price,guest_id,total_price)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (booking.checkin, booking.checkout, booking.guests, booking.room, booking.price,guest_id,total_price)
        )
        db.commit()
        return JSONResponse(status_code=201, content={"message": "Booking successful","total_price": total_price})

    except Exception as e:
        db.rollback()
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()

#  Route to Fetch All Bookings
@app.get("/fetchbookings")
async def get_bookings():
    db = create_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = db.cursor(dictionary=True)
    try:
        query = """
        SELECT 
            b.booking_id, b.checkin, b.checkout, b.guests, b.room_type, b.price,
            g.name, g.number, g.email
        FROM bookings_data b
        JOIN guests g ON b.guest_id = g.guest_id
        ORDER BY b.booking_id DESC
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()


#  Start FastAPI App
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

