import { Component, Element, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

import {
  LazyStore,
  Building,
  BuildingMap,
  Floor,
  FloorMap,
  MapElement,
} from '../../interface';

import map from '../../reducers/map-reducer';
import {
  getMapData,
  updateActiveBuilding,
  updateActiveFloor,
  updateActiveElement,
} from '../../actions/map-actions';

@Component({
  tag: 'view-map',
  styleUrl: 'view-map.scss',
})

export class ViewMap {
  private _storeUnsubscribe: Function;
  //private _fileApi = 'http://localhost:3000/api/uploads/floorplans/download/';
  // private _navSelect: MDCSelect;
  // private _navTabs: MDCTabBar;

  @Element() root: HTMLElement;

  @State() _activeBuilding: Building;
  @State() _activeFloor: Floor;
  @State() _activeElement: MapElement;
  @State() _activeFloorplan: any;

  @Prop() match: MatchResults;
  @State() _elements: Object[];
  @State() query = '';

  @State() _allBuildings: BuildingMap;
  @State() _activeFloors: FloorMap;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  async componentWillLoad() {
    if (this.match && this.match.params) {
      this.query = this.match.params.query;
    }

    this.lazyStore.addReducers({map});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().map)
    );
    
    this.lazyStore.dispatch(getMapData());
    //this._stateChanged(this.lazyStore.getState().map);
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  _stateChanged(state) {
    this._activeBuilding = state.activeBuilding;
    this._activeFloor = state.activeFloor;
    this._allBuildings = state.allBuildings;
    this._activeFloors = state.activeFloors;
    if (typeof state.activeFloorplan == 'string') {
      let i = new Image();
      i.src = state.activeFloorplan;
      this._activeFloorplan = i;
    }
    this._elements = state.activeElements;
    this._activeElement = state.activeElement;
  }

  _onElementSelected(e) {
    //console.log('Map element clicked! ' + e.detail.id);
    // Update the state with the clicked element.
    this.lazyStore.dispatch(updateActiveElement(this._elements[e.detail.id]));
  }

  _onElementDeSelected() {
    this.lazyStore.dispatch(updateActiveElement(undefined));
    //console.log('Map element deselected!' + e.detail);
  }

  render() {
    return ([
      <rula-map
        elements={this._elements}
        mapImage={this._activeFloorplan}
        onElementSelected={e => this._onElementSelected(e)}
        onElementDeselected={_ => this._onElementDeSelected()}>
      </rula-map>,

      <rula-detail-panel></rula-detail-panel>,

      <rula-map-nav
        activeFloors={this._activeFloors}
        allBuildings={this._allBuildings}
        activeBuilding={this._activeBuilding}
        activeFloor={this._activeFloor}
        onActiveFloorChanged={e => this.lazyStore.dispatch(updateActiveFloor(e.detail))}
        onActiveBuildingChanged={e => this.lazyStore.dispatch(updateActiveBuilding(e.detail))}>
      </rula-map-nav>
    ]);
  }
}