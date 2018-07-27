import { fetchJSON, fetchIMG } from '../utils/fetch.js';
import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
  MapElementMap,
  MapElementDetail,
  MapElementDetailMap,
} from '../interface.js';

export const GET_MAP_DATA = 'GET_MAP_DATA';
export const UPDATE_ACTIVE_BUILDING = 'UPDATE_ACTIVE_BUILDING';
export const UPDATE_ACTIVE_FLOOR = 'UPDATE_ACTIVE_FLOOR';
export const UPDATE_ACTIVE_ELEMENT = 'UPDATE_ACTIVE_ELEMENT';
export const UPDATE_ELEMENTS = 'UPDATE_ELEMENTS';

/**
 * Takes an Object containing multiple Floors and returns a new Object with
 * the floors that belong to the building with the given ID.
 * 
 * @param floors The array of floors to search through
 * @param id The ID of the building to match.
 */
function getFloorsForBuilding(floors: FloorMap, id): FloorMap {
  return Object.values(floors).reduce((ob, f) => {
    if (f.buildingId == id) ob[f.id] = f;
    return ob;
  }, <Floor>{})
};

function getElementsForFloor(elements: MapElementMap, id): MapElementMap {
  return Object.values(elements).reduce((ob, e) => {
    if (e.floorId == id) ob[e.id] = e;
    return ob;
  }, <MapElement>{})
};

function getDetailsForElement(details: MapElementDetailMap, id): MapElementDetailMap {
  return Object.values(details).reduce((ob, d) => {
    if (d.elementId == id) ob[d.id] = d;
    return ob;
  }, <MapElementDetail>{})
};

/**
 * The action to pull data into the store from remote storage.
 */
export const getMapData = () => async (dispatch) => {
  //const state = getState();
  //if (state.map.loaded) return;

  const base = 'http://localhost:8080/';
  const bldUrl = base + 'api/buildings';
  const floorUrl = base + 'api/floors';   
  const elUrl = base + 'api/elements';
  const dUrl = base + 'api/details';
  // const dtUrl = base + 'api/details/types';

  // Load data (synchronously for now)
  const buildings: BuildingMap = await fetchJSON(bldUrl, {method: 'GET', mode: 'cors'});
  const floors: FloorMap = await fetchJSON(floorUrl, {method: 'GET', mode: 'cors'});
  const elements: MapElementMap = await fetchJSON(elUrl, {method: 'GET', mode: 'cors'});
  const details: MapElementDetailMap = await fetchJSON(dUrl, {method: 'GET', mode: 'cors'});

  // Process buildings
  const firstBuilding = Object.values(buildings)[0];

  // Add references to the floors of each building.
  Object.values(buildings).forEach((b:Building) => {
    b.floors = getFloorsForBuilding(floors, b.id);
  });

  // Get the first floor by looking at the first floor of the current (first)
  // building.
  const firstFloor = 
      Object.values(getFloorsForBuilding(floors, firstBuilding.id))[0];

  Object.values(floors).forEach((f:Floor) => {
    f.elements = getElementsForFloor(elements, f.id);
  });

  // Object.values(details).forEach((d:MapElementDetail) => {
  //   d.type = detailTypes[d.detailTypeId];
  // });

  Object.values(elements).forEach((e:MapElement) => {
    e.details = getDetailsForElement(details, e.id);

    if (e.icon && e.icon.charAt(0) === 'h') {
      fetchIMG(e.icon).then(img => {
        e.icon = img;
      })
    }
  });
  
  // Get the floorplan of the first building.  This will be loaded immediately.
  // Remaining floorplan images will be loaded asynchronously after the fact.
  await fetchIMG(firstFloor.floorplan).then((img) => {
    // Store the src for the loaded blob and set it as the active map.
    firstFloor.floorplan = img;

    Object.values(floors).forEach((f:Floor) => {
      // Once the floorplan is loaded, the url will be `blob:http...` so check
      // if the floorplan starts with the `h` of http.
      if (f.floorplan && f.floorplan.charAt(0) === 'h') {
        fetchIMG(f.floorplan).then((img) => {
          // Store the blob source when loaded.
          f.floorplan = img;
        });
      }
    });

    return img;
  });

  dispatch({ type: GET_MAP_DATA, buildings, floors, elements});
  dispatch({ type: UPDATE_ACTIVE_BUILDING, building: firstBuilding });
  dispatch({ type: UPDATE_ACTIVE_FLOOR, floor: firstFloor });
};

export const updateActiveBuilding = (building) => (dispatch) => {
  dispatch({
    type: UPDATE_ACTIVE_BUILDING,
    building
  });

  dispatch({
    type: UPDATE_ACTIVE_FLOOR,
    floor: Object.values(building.floors)[0]
  });
}

export const updateActiveFloor = (floor) => (dispatch) => {
  dispatch({
    type: UPDATE_ACTIVE_FLOOR,
    floor
  });
}

export const updateElements = (elements) => (dispatch) => {
  dispatch({
    type: UPDATE_ELEMENTS,
    elements
  })
}

export const updateActiveElement = (element) => (dispatch) => {
  dispatch({
    type: UPDATE_ACTIVE_ELEMENT,
    element
  })
}
