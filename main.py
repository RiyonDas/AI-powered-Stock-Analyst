from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

# This allows your React app to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/compare")
def compare_stocks(ticker1: str, ticker2: str):
    # This calls your existing analysis logic for both tickers
    data1 = analyze_stock(ticker1)
    data2 = analyze_stock(ticker2)
    
    return {
        "stock1": data1,
        "stock2": data2
    }

@app.get("/analyze")
def analyze_stock(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        # Fetch 2 years to ensure we have enough for a 200-day average
        hist = stock.history(period="2y") 
        info = stock.info

        if hist.empty:
            return {"error": "Ticker not found"}

        # --- Technical Calculations ---
        current_price = hist['Close'].iloc[-1]
        ma50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        ma200 = hist['Close'].rolling(window=200).mean().iloc[-1]
        
        # RSI Calculation
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rsi = 100 - (100 / (1 + (gain / loss))).iloc[-1]

        # --- Fundamental Data ---
        pe_ratio = info.get('trailingPE', "N/A")
        market_cap = info.get('marketCap', 0)
        
        # --- Advanced Logic Verdict ---
        score = 0
        # Check for "Golden Cross" or Bullish Trend
        if ma50 > ma200: score += 1 
        if current_price > ma50: score += 1
        # Check Momentum
        if 30 <= rsi <= 50: score += 1 # "Cool" but rising

        eps = info.get('trailingEps', 0)
        market_cap = info.get('marketCap', 0)
        debt_to_equity = info.get('debtToEquity', 0) # This is usually a percentage like 45.5
        
        verdict = "Strong Buy" if score >= 2 else "Hold" if score >= 1 else "Avoid"

        return {
            "symbol": ticker.upper(),
            "currentPrice": round(current_price, 2),
            "ma50": round(ma50, 2),
            "ma200": round(ma200, 2),
            "rsi": round(rsi, 2),
            "pe": pe_ratio if pe_ratio == "N/A" else round(pe_ratio, 2),
            "trend": "Bullish" if ma50 > ma200 else "Bearish",
            "eps": round(eps, 2) if eps else 0,
            "marketCap": market_cap,
            "de": round(debt_to_equity, 2) if debt_to_equity else 0,
            "recommendation": verdict
        }
    except Exception as e:
        return {"error": str(e)}