import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const dematAccountNames = [
  "Aai",
  "Atul",
  "Sonali",
  "Vikky",
  "Mitesh",
  "Vandana",
  "Vikas",
  "Sanket",
  "Mitali",
];

const dropdownOptions = [
  "Aai Sarswat",
  "Aai Hdfc",
  "Atul HDFC",
  "Sonali Joint",
  "Sonali HDFC",
  "Vikky Union",
];

function App() {
  const [ipoData, setIpoData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ipoData");
    if (stored) {
      setIpoData(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ipoData", JSON.stringify(ipoData));
  }, [ipoData]);

  const loadDate = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }
    if (!ipoData[selectedDate]) {
      setIpoData({ ...ipoData, [selectedDate]: [] });
    }
  };

  const addIPO = () => {
    const updated = {
      ...ipoData,
      [selectedDate]: [...(ipoData[selectedDate] || []), { name: "", selections: {} }],
    };
    setIpoData(updated);
  };

  const updateIPOName = (index, value) => {
    const updated = { ...ipoData };
    updated[selectedDate][index].name = value;
    setIpoData(updated);
  };

  const updateSelection = (index, company, value) => {
    const updated = { ...ipoData };
    updated[selectedDate][index].selections[company] = value;
    setIpoData(updated);
  };

  const deleteIPO = (index) => {
    if (window.confirm("Are you sure you want to delete this IPO entry?")) {
      const updated = { ...ipoData };
      updated[selectedDate].splice(index, 1);
      setIpoData(updated);
    }
  };

  const clearDateData = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }
    if (window.confirm(`Clear all IPO data for ${selectedDate}?`)) {
      const updated = { ...ipoData };
      delete updated[selectedDate];
      setIpoData(updated);
    }
  };

  const clearAllData = () => {
    if (window.confirm("Clear ALL IPO data?")) {
      setIpoData({});
    }
  };

  // Summary counts
  const getSummary = () => {
    if (!selectedDate || !ipoData[selectedDate]) return null;
    const counts = {};
    dropdownOptions.forEach((opt) => (counts[opt] = 0));
    let hasSelection = false;

    ipoData[selectedDate].forEach((ipo) => {
      for (const company in ipo.selections) {
        const val = ipo.selections[company];
        if (val) {
          counts[val]++;
          hasSelection = true;
        }
      }
    });

    if (!hasSelection) return null;
    return counts;
  };

  const summary = getSummary();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        IPO Tracker
      </Typography>

      <Box mb={2}>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={loadDate}>
          Load Date
        </Button>
      </Box>

      {selectedDate && ipoData[selectedDate] && (
        <Box mb={2}>
          <Button variant="outlined" onClick={addIPO}>
            Add IPO Name
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {selectedDate &&
          ipoData[selectedDate] &&
          ipoData[selectedDate].map((ipo, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <TextField
                    label="IPO Name"
                    value={ipo.name}
                    onChange={(e) => updateIPOName(index, e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <IconButton
                    onClick={() => deleteIPO(index)}
                    color="error"
                    sx={{ float: "right" }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  {dematAccountNames.map((c) => (
                    <FormControl fullWidth sx={{ mb: 1 }} key={c}>
                      <InputLabel>{c}</InputLabel>
                      <Select
                        value={ipo.selections[c] || ""}
                        label={c}
                        onChange={(e) => updateSelection(index, c, e.target.value)}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {dropdownOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {summary && (
        <Box mt={3} p={2} border="1px solid #ccc" borderRadius="4px">
          <Typography variant="h6">Summary for {selectedDate}</Typography>
          {dropdownOptions.map(
            (opt) =>
              summary[opt] > 0 && (
                <Typography key={opt}>
                  {opt}: {summary[opt]} Requests
                </Typography>
              )
          )}
        </Box>
      )}

      {selectedDate && (
        <Box mt={2}>
          <Button variant="contained" color="warning" onClick={clearDateData} sx={{ mr: 2 }}>
            Clear Data for Selected Date
          </Button>
          <Button variant="contained" color="error" onClick={clearAllData}>
            Clear All Dates
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;