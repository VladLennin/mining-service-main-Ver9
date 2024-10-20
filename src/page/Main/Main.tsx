import HomeCentalBlock from "../../widget/HomeCentalBlock";
import AboutUsBlock from "../../widget/AboutUsBlock";
import PopularsBlock from "../../widget/CollectionsBlock";
import HowToMineBlock from "../../widget/HowToMineBlock";

const Main = () => {
  return (
    <div style={{overflow:'hidden'}}>
      {/* <button onClick={SoundService.makeSound}>play</button> */}
      <HomeCentalBlock />

      <PopularsBlock />

      <AboutUsBlock />

      <HowToMineBlock />
    </div>
  );
};

export default Main;
