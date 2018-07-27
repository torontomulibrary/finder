import { Component, Element, Event, EventEmitter, Prop, Watch } from '@stencil/core';

import { MDCSelect } from '@material/select';
import { MDCTabBarScroller, MDCTabBar } from '@material/tabs';

import {
  Building,
  BuildingMap,
  Floor,
  FloorMap,
} from '../../interface.js';

@Component({
  tag: 'rula-map-nav',
  styleUrl: 'map-nav.scss',
})

export class MapNav {
  private _navSelect: MDCSelect;
  private _navTabs: MDCTabBar;
  
  @Element() root: HTMLElement;

  @Prop() activeBuilding: Building;
  @Watch('activeBuilding')
  onActiveBuildingChanged(newActiveBuilding) {
    if (newActiveBuilding && newActiveBuilding > 0) {
      //this.floors = {...this.buildings[newActiveBuilding].floors};
      //this.activeFloorChanged.emit(this.floors[Object.keys(this.floors)[0]].id);
    }
  }

  @Prop() activeFloor: Floor;
  @Watch('activeFloor')
  onActiveFloorChanged(newActiveFloor) {
    if (this._navTabs && newActiveFloor) {
      // Update the active (selected) floor tab.
      //this._navTabs.activeTabIndex = newActiveFloor.id;
      Object.values(this.activeFloors).findIndex(f => f.id == newActiveFloor.id);
    }
  }

  @Prop() allBuildings: BuildingMap;
  @Prop() activeFloors: FloorMap;

  @Event() activeBuildingChanged: EventEmitter;
  @Event() activeFloorChanged: EventEmitter;

  componentDidUpdate() {
    if (!this._navSelect && this.root.querySelectorAll('option').length > 0) {
      this._navSelect = new MDCSelect(this.root.querySelector('.mdc-select'));
      this._navSelect.listen('change', _ => {
        this.activeBuildingChanged.emit(this.allBuildings[this._navSelect.value]);
      });
    }

    if (!this._navTabs && this.root.querySelectorAll('#scrollable-tab-bar > a').length > 0) {
      const scroller = new MDCTabBarScroller(
          this.root.querySelector('#tab-bar-scroller'));
      this._navTabs = scroller.tabBar;
      this._navTabs.listen('MDCTabBar:change', _ => {
        this.activeFloorChanged.emit(
          this.activeFloors[parseInt(Object.keys(this.activeFloors)[this._navTabs.activeTabIndex])]);
      });
    }
  }

  render() {
    if (!(this.allBuildings && this.activeFloors)) return;
    
    let buildings = Object.values(this.allBuildings);
    let floors = Object.values(this.activeFloors);

    return ([
      <div class='mdc-select'>
        <select class='mdc-select__native-control'>
          {buildings.map(b => 
            <option value={b.id}
                selected={this.activeBuilding.id == b.id}>
              {b.name}
            </option>
          )}
        </select>
        <div class='mdc-floating-label mdc-floating-label--float-above'>Select a Building</div>
        <div class='mdc-line-ripple'></div>
      </div>,
      <div id='tab-bar-scroller' class='mdc-tab-bar-scroller'>
        <div class='mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back'>
          <a class='mdc-tab-bar-scroller__indicator__inner material-icons' href='#' aria-label='scroll back button'>
            navigate_before
          </a>
        </div>
        <div class='mdc-tab-bar-scroller__scroll-frame'>
          <nav id='scrollable-tab-bar' class='mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs'>
            {floors.map(f =>
              <a class={`mdc-tab ${f.id == this.activeFloor.id ? 'mdc-tab--active' : ''}`}>{f.name}</a>
            )}
            <span class='mdc-tab-bar__indicator'></span>
          </nav>
        </div>
        <div class='mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward'>
          <a class='mdc-tab-bar-scroller__indicator__inner material-icons' href='#' aria-label='scroll forward button'>
            navigate_next
          </a>
        </div>
      </div>
    ]);
  }
}