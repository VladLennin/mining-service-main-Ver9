import Logo from "./Logo/Logo";
import AuthContainer from "./AuthContainer/AuthContainer";
import EarnedCounter from "./EarnedCounter/EarnedCounter";
import LangBtn from "../../../feature/LangBtn";
import css from "./Header.module.css";

interface Header{
  authorization: ()=> void;
  balance: number;
  isAuth: boolean;
}
export const Header = (props: Header) => {
  const {authorization, isAuth, balance} = props;
  return (
    <>
      <div className={css.headerDesktop}>
        <Logo />
        <div className={css.subcontainerDesktop}>
          {isAuth? <EarnedCounter count={balance} /> : null }
          <AuthContainer authorization={authorization} />
          <LangBtn />
        </div>
      </div>

      <div className={css.headerMobile}>
        <div className={css.logoLangContainer}>
          <Logo />
          <LangBtn />
        </div>
        <AuthContainer authorization={authorization} />
        {isAuth? <EarnedCounter count={balance} /> : null }
      </div>

      <div className={css.headerTablet}>
        <div className={css.subcontainerTablet}>
          <Logo />
          <div className={css.langAuthContainer}>
            <AuthContainer authorization={authorization} />
            <LangBtn />
          </div>
        </div>
        <div className={css.earnedTablet}>
          {isAuth? <EarnedCounter count={balance} /> : null }
        </div>
      </div>
    </>
  );
};
