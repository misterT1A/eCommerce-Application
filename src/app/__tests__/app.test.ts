import styles from '../_app_style.scss';
import App from '../app';
import Pages from '../router/pages';

describe('App', () => {
  let app: App;
  beforeEach(() => {
    app = new App();
  });

  it('Should add a section to the body', () => {
    app.showContent(document.body);

    const section = document.querySelector(styles.section);
    expect(section.tagName).toBe('SECTION');
  });

  it('should return the required paths for the router', () => {
    const routes = app['createsRoutes']();

    const pages = [Pages.MAIN, Pages.LOGIN, Pages.REG, Pages.ERROR];

    expect(routes).toHaveLength(4);

    routes.forEach((route, index) => {
      expect(route.path).toBe(pages[index]);
      expect(typeof route.callBack).toBe('function');
      expect(Object.prototype.toString.call(route.callBack())).toBe('[object Promise]');
    });
  });
});
