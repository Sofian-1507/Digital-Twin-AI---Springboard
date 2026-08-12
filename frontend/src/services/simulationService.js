const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

export const runFinanceSimulation = async (
  simulationData
) => {

  const response = await fetch(
    `${API_BASE_URL}/simulation/run`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(
        simulationData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Simulation failed"
    );
  }

  return data;
};
export const runFinanceScenarios = async (
  simulationData
) => {

  const response = await fetch(
    `${API_BASE_URL}/simulation/scenarios`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(
        simulationData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Scenario simulation failed"
    );
  }

  return data;
};