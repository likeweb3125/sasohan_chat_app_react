import Header from "./Header";

const Layout = (props) => {

    return(
        <>
            <Header />
            <div className="content_wrap">
                {props.children}
            </div>
        </>
    );
};

export default Layout;