import { Component, Element, Prop, State } from '@stencil/core';

import {
  LazyStore,
  MapElementDetail,
} from '../../interface';

import map from '../../reducers/map-reducer';


@Component({
  tag: 'rula-detail-panel',
  styleUrl: 'detail-panel.scss',
  host: {
    theme: 'rula-detail-panel'
  }
})

export class DetailPanel {
  private _storeUnsubscribe: Function;

  @Element() root: HTMLStencilElement;

  @State() _details: MapElementDetail[] = [];
  @State() _open = false;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  async componentWillLoad() {
    this.lazyStore.addReducers({map});
    this._storeUnsubscribe = this.lazyStore.subscribe(() =>
      this._stateChanged(this.lazyStore.getState().map)
    );
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  _stateChanged(state) {
    if (state.activeElement && state.activeElement.details) {
      this._details = Object.values(state.activeElement.details);
      this.root.forceUpdate();
      this._open = true;
      this.root.style.visibility = 'visible';
      this.root.style.transform = 'translateX(100%)';
    } else {
      this._open = false;
      this.root.style.visibility = 'hidden';
      this.root.style.transform = 'translateX(0)';
    }
  }

  render() {
    return (
      <div class='rula-detail-panel__content'>
        {this._details.map((detail:MapElementDetail) => ([
          <div>{detail.name}</div>,
          <div>{detail.description}</div>
        ]))}
      </div>
    );
  }
}