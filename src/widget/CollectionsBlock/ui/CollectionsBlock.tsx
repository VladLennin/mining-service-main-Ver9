import AppearBlock from "../../../feature/AppearBlock/AppearBlock";
import ItemCard from "../../../feature/ItemCard/ItemCard";
import TitleWithBgLine from "../../../shared/ui/TitleWithBgLine/TitleWithBgLine";
import css from "./CollectionsBlock.module.css";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import { id } from "ethers";

import {Web3} from "web3";
import {ContractTokenABI} from "../../../ABI";
import {AddressToken} from "../../../AddressContract";

import {ContractABI} from "../../../ABI";
import {Address} from "../../../AddressContract";
import { contract } from "web3/lib/commonjs/eth.exports";

declare var window: any
var web3: any;
var account: any;


export interface Cards {
    title: string;
    earning: string,
    images: string[];
    wasBought: boolean;
    earned: string;
    startedEarning: boolean;
    id: string;
}

const cards = [{
    title: "Deadpool",
    earning: "10.00 MD",
    images: ["Deadpool-1.png", "Deadpool-2.png", "Deadpool-3.png"],
    wasBought: true,
    earned: "0 MD",
    startedEarning: false,
    id: "0",
},
    {
        title: "Venom",
        earning: "20.00 MD",
        images: ["Venom-1.png", "Venom-2.png", "Venom-3.png"],
        wasBought: true,
        earned: "0 MD",
        startedEarning: false,
        id: "1",
    },
    {
        title: "Penguin",
        earning: "30.00 MD",
        images: ["penguin-1.png", "penguin-2.png", "penguin-3.png"],
        wasBought: true,
        earned: "0 MD",
        startedEarning: false,
        id: "2",
    },
    {
        title: "Harley Quinn",
        earning: "40.00 MD",
        images: ["Harley Qu-1.png", "Harley Qu-2.png", "Harley Qu-3.png"],
        wasBought: true,
        earned: "0 MD",
        startedEarning: false,
        id: "3",
    },
    {
        title: "Joker",
        earning: "50.00 MD",
        images: ["Joker-1.png", "Joker-2.png", "Joker-3.png"],
        wasBought: true,
        earned: "0 MD",
        startedEarning: false,
        id: "4",
    }]

export const PopularsBlock = () => {
    const [t] = useTranslation(["translation"]);
    const [dataArray, setDataArray] = useState<Cards[]>([]);

    useEffect(() => {
        getAllItem();
    }, []);

    const getAllItem = async () => {
        let contract1 : any;
        let  newArray : Cards [];

        try{

        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                web3 = new Web3(window.ethereum);
                account = accounts[0];
            } catch (error) {
                console.log("Error connecting...");
            }
        } else {
            console.log("Download Metamask");
        }
    
        contract1 = new web3.eth.Contract(ContractTokenABI, AddressToken);
        }

        catch(e){
            console.log(e);
        }

        // Use Promise.all to wait for all async calls
        const promises = cards.map(async (item) => {
            let count : number;

            console.log(item.id, "Тут має бути запрос по отриманню по смарт контракту кількості токенів");

            try{
             count = await contract1.methods.checkReward(account, Number(item.id) + 1).call();
            }
            catch (e){
             count = 0;
            }
            return {
                ...item,
                wasBought: true,
                earned: `${count} MD`,
                startedEarning: false
            };
        });
    
        // Wait for all promises to resolve


        try{
         newArray = await Promise.all(promises);
        }
        catch(e){
            newArray = cards;
        }
    
        // After all promises are resolved, update state
        setDataArray(newArray);
    };
    

   async function getDataArray(_id:string) {
        const array = dataArray;

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
        

        array[Number(_id)] = {
            ...dataArray[Number(_id)],
            wasBought: true,
            earned: `${await contract.methods.checkReward(account, _id+1).call()} MD`,
           // earned: `${10} MD`,
            startedEarning: false
        }
       
        setDataArray(array);
    }

    const changeStateEarning = async (id: string) => {

        let contract1 : any;
        let contractNFT : any;

         //////////////////////////////////////////////////////////////////////////   
         
         try{
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

         contract1 = new web3.eth.Contract(ContractTokenABI, AddressToken);
         contractNFT = new web3.eth.Contract(ContractABI, Address);
    }
    catch(e){
        alert("Download Metamask");
    }
       

        const updatedArray = await Promise.all(dataArray.map(async (item) => {
            if (id === item.id) {
                const earned: number = Number(item.earned.split(' ')[0]);

                let amount : number;

                try{
                 amount  = Number(await contractNFT.methods.balanceOf(account, Number (id)+1).call());
                }
                catch(e){
                    amount = 0;
                }

                if (amount === 0) 
                    {
                    alert("Please buy token");
                }
                if (earned === 0 && amount > 0 ) 
                     {
                   
                    contract1.methods.StartMiner(Number (id)+1).send({from: account})   

                    item = {
                        ...item,
                        startedEarning: !item.startedEarning
                    };
                    console.log(item.startedEarning, "Start");

                } else if (!item.startedEarning && earned > 0 && amount > 0) {
                    
                     contract1.methods.GetReward(Number (id)+1).send({from: account})

                    item = {
                        ...item,
                        startedEarning: !item.startedEarning
                    };
                    console.log(item.startedEarning, "Sell");
                }
            }
            return item;
        }));
    
   
        setDataArray(updatedArray);
        
    }


    return (
        <div className={css.container}>
            <TitleWithBgLine value={t("mainpage.populars-block.title")}/>

            <div className={css.itemContainer}>
                {dataArray.map((item, index) => (
                    <AppearBlock direction="bottom">
                        <ItemCard item={item} changeStateEarning={()=>changeStateEarning(item.id)}/>
                    </AppearBlock>
                ))}
            </div>
        </div>
    );
};
