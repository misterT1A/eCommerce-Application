import styles from '../_app_style.scss';
import App from '../app';

describe('App', () => {
  it('Should add a section to the body', () => {
    const app = new App();
    app.showContent(document.body);

    const section = document.querySelector(styles.section);
    expect(section.tagName).toBe('SECTION');
  });
});
