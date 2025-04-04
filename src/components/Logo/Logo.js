import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Logo.module.scss";
import logo from "assets/images/logo-dark.png";
const cx = classNames.bind(styles);

function Logo({ noName }) {
    return ( 
        <div className={cx("logo-container")}>
        <Link to="/" >
          <img src={logo} alt="The Pham AI" className={cx("logo")} />
        </Link>
        {!noName && <span className={cx("company-name")}>The Pham AI</span>}
      </div>
     );
}

export default Logo;