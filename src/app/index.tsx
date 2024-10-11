import React, {useState} from "react";
import "./index.css";
import {withProviders} from "./providers";
import Routing from "../page";
import Header from "../widget/Header";
import Footer from "../widget/Footer";
import AppearBlock from "../feature/AppearBlock/AppearBlock";

import {Web3} from "web3";
import {ContractTokenABI} from "../ABI";
import {AddressToken} from "../AddressContract";

declare var window: any
var web3: any;
var account: any;

const App = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const location = window.location.href

    async function authorization() {// авторизація
        console.log("Authorization");
        try {

            //////////////////////////////////////////////////////////////////////////
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    web3 = new Web3(window.ethereum)
                    account = accounts[0];
                } catch (error) {
                    console.log("Error connecting...");
                }
            } else {
                console.log("Download Metamask");
            }
            /////////////////////////////////////////////////////////////////////////////

            let contract = new web3.eth.Contract(ContractTokenABI, AddressToken);
            setIsAuth(true);

            setBalance(web3.utils.fromWei(await contract.methods.balanceOf(account).call(), 'ether'));//your variable


            ;
        } catch (e) {
            console.log(e);
        }
    }

    const isAdminRoute = location.includes("/admin");

    return (
        <>
            {!isAdminRoute && (
                <AppearBlock direction="top">
                    <Header authorization={authorization} balance={balance} isAuth={isAuth}/>
                </AppearBlock>
            )}
            <div className="content" id="content">
                <Routing/>
            </div>


            {!isAdminRoute && <Footer />}
        </>
    );
};

export default withProviders(App);
