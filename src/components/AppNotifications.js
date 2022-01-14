import { createElement, useState } from "react";


var showStyle = {
	position: "fixed",
	textAlign: "center",
	top: "15px",
	right: "15px",
	zIndex: 1200,
	fontSize: "1.2em",
}

var hideStyle = {
    display: "none"
}

const AppAlert = ({ alert }) => {
    const [style, setStyle] = useState(showStyle);
    return createElement(
        () => <div className={"alert alert-"+alert.variant+" alert-dismissible fade show"} role="alert" style={style}>
                     <h4 className="alert-heading">{alert.title}</h4>
                     <hr />
                     <p className="mb-0">{alert.text}</p>
                 <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setStyle(hideStyle)}></button>
               </div>,
        { key: alert }
      );

}

const AppNotifications = ({ notifications }) => {
    return createElement(
        () => <>
            {notifications.map((item, i) => <AppAlert alert={ item } key={i}/>)}
        </>
    )
};


export default AppNotifications;