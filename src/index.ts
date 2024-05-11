import './index.html';
import './style.scss';

import App from './app/app';
// import AuthService from './app/services/auth-service';

const app = new App();
app.showContent(document.body);

// const apiRoot = AuthService.getRoot();
// apiRoot.get().execute();
