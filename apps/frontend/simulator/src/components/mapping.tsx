import { makeStyles, Grid, Select, MenuItem, Button } from "@material-ui/core";
import { Loader } from "google-maps";
import {
  useState,
  FunctionComponent,
  useEffect,
  useCallback,
  FormEvent,
  useRef,
} from "react";
import { Route } from "../domain/models";
import { getCurrentPosition } from "../util/geolocation";
import { sample, shuffle } from "lodash";
import { RouteExistsError } from "../errors/route-exists.error";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/map";
import { useSnackbar } from "notistack";
import { Navbar } from "./navbar";
import io from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL as string;

// Insert a google maps javascript api here
const googleMapsLoader = new Loader("");

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "955px",
  },
  form: {
    margin: "16px",
  },
  btnSubmitWrapper: {
    textAlign: "center",
    marginTop: "8px",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export const Mapping: FunctionComponent = () => {
  const classes = useStyles();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = useRef<Map>();
  const socketIORef = useRef<SocketIOClient.Socket>();
  const { enqueueSnackbar } = useSnackbar();

  const finishRoute = useCallback(
    (route: Route) => {
      enqueueSnackbar(`${route.title} finalizou!`, {
        variant: "success",
      });
      mapRef.current?.removeRoute(route._id);
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (!socketIORef.current?.connected) {
      socketIORef.current = io.connect(API_URL);
      socketIORef.current.on("connect", () => console.log("conectou"));
    }

    const handler = (data: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      console.log(data);
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1],
      });
      const route = routes.find((route) => route._id === data.routeId) as Route;
      if (data.finished) {
        finishRoute(route);
      }
    };
    socketIORef.current?.on("new-position", handler);
    return () => {
      socketIORef.current?.off("new-position", handler);
    };
  }, [finishRoute, routes, routeIdSelected]);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        await googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);
      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  // Iniciar a rota
  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault();
    console.log(routeIdSelected);
  }, []);

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} sm={3}>
        <Navbar />
        <form onSubmit={startRoute} className={classes.form}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value + "")}
          >
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route, key) => (
              <MenuItem key={key} value={route._id}>
                {route.title}
              </MenuItem>
            ))}
          </Select>
          <div className={classes.btnSubmitWrapper}>
            <Button type="submit" color="primary" variant="contained">
              Iniciar uma corrida
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" className={classes.map} />
      </Grid>
    </Grid>
  );
};
