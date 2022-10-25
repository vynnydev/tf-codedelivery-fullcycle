import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { Mapping } from "./components/mapping";
import theme from "./theme";

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <Mapping />
        </SnackbarProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
