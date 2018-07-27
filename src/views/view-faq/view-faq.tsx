import { Component, State } from '@stencil/core';
import { fetchJSON } from '../../utils/fetch';
import { sanitize } from '../../utils/sanitize';

@Component({
  tag: 'view-faq',
  styleUrl: 'view-faq.scss',
  host: {
    theme: ''
  }
})

export class ViewFaq {
  @State() faqs: Array<any> = [];

  render() {
    return (
      <div id="container" class="grid-container" role="list">
        {this.faqs.map((faq, idx) =>
          <rula-expandable-card tabindex="0" role="listitem" delay={(idx + 1) * 20} fade-in aria-label={`Question: ${faq.question}`}>
            <div main-content>
              <rula-graphic-device width={400} height={250}></rula-graphic-device>
              <div class="textProtection"></div>
              <span class="faq-question">Q: {faq.question}</span>
            </div>
            <div class="faq-answer" extra-content innerHTML={faq.answer} aria-label={`Answer: ${sanitize(faq.answer)}`}></div>
          </rula-expandable-card>
        )}
      </div>
    );
  }

  componentWillLoad() {
    fetchJSON('https://testnet.library.ryerson.ca/dev/kiosk/pub/get_faq').then(results => {
      this.faqs = this.faqs.concat(results);
    });
    document.title = 'FAQs - RULA Finder';
  }

  componentDidLoad() {
    console.log('loaded');
  }

  componentDidUnload() {
    document.title = 'RULA Finder'
  }
}
