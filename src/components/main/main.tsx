import { Component, Element, Prop, State } from '@stencil/core';
//import { RouterSwitch } from '@stencil/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { MDCTextField } from '@material/textfield';
import { LazyStore } from '../../interface';
import '@rula/web-components';

import { updateDrawerState } from '../../actions/app';

import app from '../../reducers/app';

@Component({
  tag: 'rula-finder',
  styleUrl: 'main.scss'
})
export class Main  {
  _topBar: MDCTopAppBar;
  _search: MDCTextField;

  private _storeUnsubscribe: Function;

  @Element() root: HTMLStencilElement;

  @State() _drawerOpened: boolean;
  @State() _page: string;

  @Prop({ context: 'lazyStore' }) lazyStore: LazyStore;

  componentWillLoad() {
    this.lazyStore.addReducers({app});
    this._storeUnsubscribe = this.lazyStore.subscribe(() => 
      this._stateChanged(this.lazyStore.getState())
    );
  }

  componentDidLoad() {
    this._topBar = new MDCTopAppBar(this.root.querySelector('.mdc-top-app-bar'));
    this._search = new MDCTextField(this.root.querySelector('.mdc-text-field'));
  }

  componentDidUnload() {
    this._storeUnsubscribe();
  }

  _openDrawer() {
  }

  _stateChanged(state) {
    this._drawerOpened = state.app.drawerOpened;
  }

  render() {
    return ([
      <header class='mdc-top-app-bar'>
        <div class='mdc-top-app-bar__row'>
          <section class='mdc-top-app-bar__section mdc-top-app-bar__section--align-start'>
            <button class='material-icons mdc-top-app-bar__navigation-icon' onClick={_ => this.lazyStore.dispatch(updateDrawerState(true))}>menu</button>
            <span class='mdc-top-app-bar__title'>RULA Finder</span>
          </section>
          <section class='mdc-top-app-bar__section mdc-top-app-bar__section--align-middle'>
            <rula-search-box></rula-search-box>
          </section>
          <section class='mdc-top-app-bar__section' />
        </div>
      </header>,

      <rula-drawer open={this._drawerOpened} onDrawerClose={_ => this.lazyStore.dispatch(updateDrawerState(false))}>
        <header class='mdc-drawer__header'>
          <div class='mdc-drawer__header-content'>
            RULA Finder
          </div>
        </header>
        <nav id='icon-with-text-demo' class='mdc-drawer__content mdc-list'>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/' exact>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>home</i>Home
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/map'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>map</i>Directory
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/building'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>business</i>Building Info
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/event'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>event</i>Events
          </stencil-route-link>
          <stencil-route-link anchorClass='mdc-list-item' activeClass='mdc-list-item--activated' url='/faq'>
            <i class='material-icons mdc-list-item__graphic' aria-hidden='true'>question_answer</i>FAQs
          </stencil-route-link>
        </nav>
      </rula-drawer>,

      <main class="main-content">
        <stencil-router id="router">
          <stencil-route-switch>
            <stencil-route url="/" component='view-home' exact={true}></stencil-route>
            <stencil-route url={['/building', '/building/']} component='view-building'></stencil-route>
            <stencil-route url={['/event', '/event/']} component='view-event'></stencil-route>
            <stencil-route url={['/faq', '/faq/']} component='view-faq'></stencil-route>
            <stencil-route url={['/map/:query?', '/map']} component='view-map'></stencil-route>
          </stencil-route-switch>
        </stencil-router>
      </main>
    ]);
  }
}
