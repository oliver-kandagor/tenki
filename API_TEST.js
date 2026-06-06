/**
 * API Integration Test
 * Run this to verify WeatherAI API is properly configured and working
 * 
 * Test: GET /v1/current with real API key
 */

const API_KEY = "wai_43d954.8567b3b9df13473cb6091b9afcb9faef1650e529e94df750";
const BASE_URL = "https://api.weather-ai.co";

async function testWeatherAPI() {
  console.log("🧪 Testing WeatherAI API Integration...\n");

  // Test 1: Check API Key exists
  console.log("✓ Step 1: API Key configured");
  console.log(`  Key: ${API_KEY.substring(0, 15)}...`);

  // Test 2: Try a simple current weather call
  try {
    console.log("\n✓ Step 2: Testing /v1/current endpoint");
    const response = await fetch(
      `${BASE_URL}/v1/current?lat=-1.286389&lon=36.817223&units=metric&ai=true`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`  Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log("  ✅ SUCCESS! API returned data:");
      console.log(`     Location: ${data.location?.name}`);
      console.log(`     Temperature: ${data.current?.temperature}°C`);
      console.log(`     Condition: ${data.current?.condition}`);
      console.log(`     AI Summary: ${data.ai_summary ? "✓ Available" : "✗ Not available"}`);
    } else {
      const error = await response.text();
      console.log(`  ❌ ERROR: ${error}`);
    }
  } catch (err) {
    console.log(`  ❌ NETWORK ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Test 3: Try daily forecast
  try {
    console.log("\n✓ Step 3: Testing /v1/daily endpoint");
    const response = await fetch(
      `${BASE_URL}/v1/daily?lat=-1.286389&lon=36.817223&days=7&units=metric&ai=false`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(`  Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      const dailyCount = data.daily?.length ?? 0;
      console.log(`  ✅ SUCCESS! Got ${dailyCount} days of forecast`);
    } else {
      const error = await response.text();
      console.log(`  ❌ ERROR: ${error}`);
    }
  } catch (err) {
    console.log(`  ❌ NETWORK ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Test 4: Check usage/quota
  try {
    console.log("\n✓ Step 4: Testing /v1/usage endpoint");
    const response = await fetch(
      `${BASE_URL}/v1/usage`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(`  Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log("  ✅ SUCCESS! Usage data:");
      console.log(`     Requests: ${data.requests_used ?? "?"} / ${data.requests_limit ?? "?"}`);
      console.log(`     AI Requests: ${data.ai_requests_used ?? "?"} / ${data.ai_requests_limit ?? "?"}`);
    } else {
      const error = await response.text();
      console.log(`  ❌ ERROR: ${error}`);
    }
  } catch (err) {
    console.log(`  ❌ NETWORK ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  console.log("\n\n✅ API Integration Test Complete!");
  console.log("\nExpected app behavior:");
  console.log("1. OnboardingNavigator → GetStartedScreen");
  console.log("2. User completes onboarding → hasCompletedOnboarding = true");
  console.log("3. Navigation switches to AppNavigator");
  console.log("4. TodayScreen loads → fetches /v1/current with lat/lon");
  console.log("5. useLocation hook gets GPS permission (or IP fallback)");
  console.log("6. Weather data displays with hero background");
  console.log("7. Tab switcher allows Hourly/10Days/Monthly views");
  console.log("8. All metrics display correctly");
}

testWeatherAPI();
