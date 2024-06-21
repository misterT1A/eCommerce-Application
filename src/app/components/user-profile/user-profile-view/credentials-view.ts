import MyCustomer from '@services/customer-service/myCustomer';
import BaseComponent from '@utils/base-component';
import copyTextInClipboard from '@utils/copy-text-to-clipboard';
import { button, div, h2, p, span } from '@utils/elements';

import styles from './_user-profile.scss';

class CredentialsView extends BaseComponent {
  public profileName: BaseComponent<HTMLHeadingElement>;

  public circle: BaseComponent<HTMLElement>;

  public email: BaseComponent<HTMLSpanElement>;

  public dateOfBirth: BaseComponent<HTMLSpanElement>;

  public password: BaseComponent<HTMLSpanElement>;

  public editButton: BaseComponent<HTMLButtonElement>;

  private profileID: BaseComponent<HTMLElement>;

  constructor() {
    super({ tag: 'div', className: styles.profile__userInfo });
    const header = div([styles.profile__userInfoHeader]);
    this.circle = div([styles.profile__userInfoCircle]);
    this.profileName = h2([styles.profile__userInfoName], '');
    this.profileID = p([styles.profile__userInfoDataID], '');
    this.profileID.addListener('click', () =>
      copyTextInClipboard(MyCustomer.id ?? '', 'Your id was copied to clipboard!')
    );
    header.appendChildren([
      this.circle,
      div(
        [styles.profile__userInfoTitleWrapper],
        this.profileName,
        div([styles.profile__userInfoIdWrapper], span([styles.profile__userInfoData], 'id:'), this.profileID)
      ),
    ]);
    this.email = span([styles.profile__userInfoData], '');
    this.dateOfBirth = span([styles.profile__userInfoData], '');
    this.password = span([styles.profile__userInfoData], '');
    this.editButton = button([styles.profile__button], 'EDIT');
    this.appendChildren([
      header,
      this.wrapField('Email:', this.email),
      this.wrapField('Password:', this.password),
      this.wrapField('Date of Birth:', this.dateOfBirth),
      this.editButton,
    ]);
    this.updateView();
  }

  public updateView() {
    this.circle.setTextContent(MyCustomer.inn);
    this.profileName.setTextContent(MyCustomer.fullName);
    this.email.setTextContent(MyCustomer.email);
    this.password.setTextContent(MyCustomer.password);
    this.dateOfBirth.setTextContent(MyCustomer.dateFormatted);
    this.profileID.setTextContent(`${MyCustomer.id?.split('-')[0] ?? ''}- ...`);
  }

  private wrapField(label: string, field: BaseComponent) {
    return div([styles.profile__userInfoDataWrapper], span([styles.profile__userInfoDataLabel], label), field);
  }
}

export default CredentialsView;
