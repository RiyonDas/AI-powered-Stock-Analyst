# AI-powered Stock Analyst
An Analytics platform that suggests you to Buy/Sell/Hold a security with respect to real-time Financial Data. 

## Here is a breakdown of what you can compare on Simplistoxx.com:
In US Markets (NYSE):
1. AAPL 
2. TSLA
3. NVDA 
4. MSFT
5. AMZN

In Indian Markets (NSE & BSE):
1. RELIANCE.NS
2. TCS.NS
3. HDFCBANK.NS
4. INFY.NS

**Usage of suffixes such as: .NS, .BO, .L, .TO, .DE are also acceptable**

## Data Source:
Yahoo Finance Server

## Data Parameters used for security analysis:
1. Relative Strength Index (RSI) -
   1. Under 30: Oversold;
   2. Over 70: Overbought.

3. Moving Average (MA) -
   1. If MA50 > MA200, then "Bullish";
   2. If MA50 < MA200, then "Bearish".
   
4. Combined Recommendation Logic -
   The final "Verdict" (Strong Buy, Hold, Sell) is determined by combining these:
   1. Strong Buy: If the Trend is Bullish AND RSI is not Overbought (< 70);
   2. Hold: If the Trend is Bullish but the RSI is getting too high;
   3. Sell/Avoid: If the Trend is Bearish.

6. How the "AI Choice" (Winner) is Picked -
   1. +10 Points for a "Strong Buy" recommendation;
   2. +5 Points if the RSI is under 50 (indicating room to grow);
   3. Comparison: The stock with the highest points gets the WINNER.

## Commands to RUN the terminals -
   1. Backend:- uvicorn main:app --reload
   2. Frontend:- npm run dev

   
