import React from "react";
import {Link} from "react-router-dom";
import "../assets/scss/Brand.scss";
import Logo from "../assets/img/headphonesLogo.svg"

class Brand extends React.Component {
    render() {
        return (
            <div  className={"brand"}>
                <Link to={"/home"}>
                    <h1>
                        <img src={Logo} width={"24px"} alt=""/>
                        SaReGaMa
                    </h1>
                </Link>
            </div>
        );
    }
}

export default Brand;