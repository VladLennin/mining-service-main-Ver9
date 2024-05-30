import Button from "../../../../shared/ui/Button/Button";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import css from "./AuthContainer.module.css";

interface AuthContainer {
    authorization: ()=> void;
}

const AuthContainer = (props: AuthContainer) => {
    const {authorization} = props
    const [t] = useTranslation(["translation"]);


    return (
        <div className={css.container123}>
            <Button onClick={authorization} transparent>
                <>{t("auth.registration")}</>
            </Button>
        </div>
    );
};

export default observer(AuthContainer);
