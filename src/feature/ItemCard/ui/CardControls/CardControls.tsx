import css from "./CardControls.module.css";
import Button from "../../../../shared/ui/Button/Button";
import {useTranslation} from "react-i18next";
import {useState} from "react";

import {Web3} from "web3";

import {ContractTokenABI} from "../../../../ABI";
import {AddressToken} from "../../../../AddressContract";

import {ContractABI} from "../../../../ABI";
import {Address} from "../../../../AddressContract";

import {accounts} from "web3/lib/commonjs/eth.exports";

declare var window: any
var web3: any;
var account: any;


interface CardControls {
    id: string;
}

const CardControls = (props: CardControls) => {
    const {id} = props;
    const [t] = useTranslation();
    const [counter, setCounter] = useState<number>(1);

    const buyBtnHandler = async () => {
        console.log(`I want buy ${counter} cards with id:${id}`);
        try {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    web3 = new Web3(window.ethereum)
                    account = accounts[0];
                    console.log(accounts[0]);
                } catch (error) {
                    console.log("Error connecting...");
                }
            } else {
                console.log("Download Metamask");
            }


 ////////////////////////////////////////////////////////////////////////////////////////////////////           
            let contract = new web3.eth.Contract(ContractTokenABI, AddressToken);
            let contractNFT = new web3.eth.Contract(ContractABI, Address);    
           
            await contract.methods.increaseAllowance(Address,3800 * 10 **18 * counter).send({from: account}) //потверждение списания средств
            await contractNFT.methods.buyNFT(counter,id+1).send({from: account})   //списание средств
           

        } catch (e) {
            alert(`You want buy ${counter} cards with id:${id}. Download Metamask to do it.`);
        }
    }

    return (
        <div className={css.container}>
            <div className={css.counter}>
                <button
                    className={css.minusBtn}
                    onClick={() => {
                        if (counter !== 1) {
                            setCounter(counter - 1);
                        }
                    }}
                >
                    -
                </button>
                <p className={css.counterValue}>{counter}</p>
                <button
                    className={css.plusBtn}
                    onClick={() => {
                        setCounter(counter + 1);
                    }}
                >
                    +
                </button>
            </div>
            <Button onClick={buyBtnHandler} className={css.buyBtn}>{t("buttons.buy-btn")}</Button>
        </div>
    );
};

export default CardControls;
