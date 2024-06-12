import AuthService from '@services/auth-service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div } from '@utils/elements';

import styles from './_burger-style.scss';
import mainStyles from './_style.scss';

export default class BurgerMenu extends BaseComponent {
  protected router: Router;

  protected burgerBtn: BaseComponent;

  protected changeTextCallback: () => void;

  protected contentWrapper = div([styles.menuBlock]);

  constructor(router: Router, btn: BaseComponent, changeText: () => void) {
    super({ className: styles.backgroundWrapper });
    this.router = router;

    this.burgerBtn = btn;
    this.changeTextCallback = changeText;

    this.setMenuContent();
    this.setUserBlock();
    this.append(this.contentWrapper);
    this.addListener('click', (e: Event) => this.navigate(e));
    window.addEventListener('resize', () => this.resizeHandeler());
  }

  private setMenuContent() {
    const wrapper = div([styles.menuWrapper]);
    const props: Props[] = [
      { tag: 'span', textContent: 'HOME', className: styles.menuBtn },
      {
        tag: 'span',
        textContent: 'CATALOG',
        className: styles.menuBtn,
      },
      {
        tag: 'span',
        textContent: 'ABOUT US',
        className: styles.menuBtn,
      },
    ];
    props.forEach((prop) => wrapper.append(new BaseComponent(prop)));
    this.contentWrapper.append(wrapper);
  }

  private setUserBlock() {
    const isAuthorized = AuthService.isAuthorized();
    const wrapper = div([styles.userWrapper]);
    const props: Props[] = [
      {
        tag: 'li',
        className: styles.menuBtn,
        textContent: 'Log In',
      },
      {
        tag: 'li',
        className: styles.menuBtn,
        textContent: 'Sign Up',
      },
    ];
    props.forEach((prop) => {
      if (prop.textContent !== 'Log Out') {
        const element = new BaseComponent(prop);
        wrapper.append(element);
      } else if (isAuthorized) {
        const element = new BaseComponent(prop);
        wrapper.append(element);
      }
    });
    this.contentWrapper.append(wrapper);
  }

  private resizeHandeler() {
    const width = window.innerWidth;

    if (width > 1000 && this.burgerBtn.getNode().classList.contains(mainStyles.burgerBtn_active)) {
      document.body.classList.remove(styles.bodyHidden);
    } else if (this.burgerBtn.getNode().classList.contains(mainStyles.burgerBtn_active)) {
      document.body.classList.add(styles.bodyHidden);
    }
  }

  public toggleMenu() {
    this.burgerBtn.getNode().classList.toggle(mainStyles.burgerBtn_active);
    this.contentWrapper.getNode().classList.toggle(styles.menuBlockActive);
    this.getNode().classList.toggle(styles.wrapperActive);

    if (document.body.classList.contains(styles.bodyHidden)) {
      document.body.classList.remove(styles.bodyHidden);
    } else {
      document.body.classList.add(styles.bodyHidden);
    }
  }

  public changeTextLoggined() {
    const links = this.contentWrapper.getChildren[1];
    links.destroyChildren();
    links.append(new BaseComponent({ tag: 'li', className: styles.menuBtn, textContent: 'My Account' }));
    links.append(new BaseComponent({ tag: 'li', className: styles.menuBtn, textContent: 'Log Out' }));
  }

  public changeTextNotLoginned() {
    const links = this.contentWrapper.getChildren[1];
    links.destroyChildren();
    links.append(new BaseComponent({ tag: 'li', className: styles.menuBtn, textContent: 'Log In' }));
    links.append(new BaseComponent({ tag: 'li', className: styles.menuBtn, textContent: 'Sign Up' }));
  }

  private navigate(e: Event) {
    this.toggleMenu();
    const target = (e.target as HTMLElement)?.textContent;
    switch (target) {
      case 'HOME':
        this.router.navigate(Pages.MAIN);
        break;
      case 'CATALOG':
        this.router.navigate(Pages.CATALOG);
        break;
      case 'ABOUT US':
        this.router.navigate(Pages.ABOUT);
        break;
      case 'Log In':
        this.router.navigate(Pages.LOGIN);
        break;
      case 'Sign Up':
        this.router.navigate(Pages.REG);
        break;
      case 'My Account':
        this.router.navigate(Pages.ACCOUNT);
        break;
      case 'Log Out':
        this.changeTextNotLoginned();
        this.changeTextCallback();
        AuthService.logout();
        this.router.navigateToLastPoint();
        break;
      default:
        break;
    }
  }
}
