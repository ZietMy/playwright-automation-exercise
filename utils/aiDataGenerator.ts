import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface UserProfile {
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company?: string; // Optional field for company
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export async function generateRandomUser(): Promise<UserProfile> {
  const timestamp = Date.now();
  const prompt = `Generate a realistic user profile for e-commerce testing in valid JSON format only (no markdown, no backticks).
  The JSON structure must match these exact keys:
  {
    "name": "Full Name",
    "password": "StrongPassword123!",
    "day": "1" to "28",
    "month": "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", or "December",
    "year": "1980" to "2000",
    "firstName": "First Name",
    "lastName": "Last Name",
    "company": "Tech Corp (optional)",
    "address": "Street Address",
    "country": "United States",
    "state": "State Name",
    "city": "City Name",
    "zipcode": "5-digit zip",
    "mobile": "10-digit phone number"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json', // Ép Gemini luôn trả về dạng JSON chuẩn
      },
    });

    const content = response.text || '{}';
    const data = JSON.parse(content);

    // Gắn thêm timestamp vào email để đảm bảo luôn duy nhất khi chạy test nhiều lần
    data.email = `qa_ai_${timestamp}@example.com`;

    return data as UserProfile;
  } catch (error) {
    console.warn('AI Data generation failed. Falling back to default test data:', error);
    // Fallback data nếu API gặp lỗi hoặc hết quota
    return {
      name: 'Testtt',
      email: `qa_fallback_${timestamp}@example.com`,
      password: 'Password123!',
      day: '10',
      month: 'May',
      year: '1995',
      firstName: 'Fallback',
      lastName: 'Tester',
      address: '123 QA Street',
      country: 'United States',
      state: 'California',
      city: 'San Jose',
      zipcode: '95101',
      mobile: '1234567890',
    };
  }
}