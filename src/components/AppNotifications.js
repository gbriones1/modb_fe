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

const AppToast = ({ color, text }) => {
    return (
        <div className={"toast show text-white bg-"+color} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    {text}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    )
}

const AppNotifications = ({ notifications }) => {
    // return <>
    //         {notifications.map((item, i) => <AppAlert alert={ item } key={i}/>)}
    //     </>
    return (
        <div aria-live="polite" aria-atomic="true" className="position-relative" style={{zIndex: 1056}}>
            <div className="toast-container position-fixed top-0 end-0 p-3">

                {/* <div class="toast show text-white bg-primary" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Bootstrap</strong>
                        <small class="text-muted">just now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="d-flex">
                        <div class="toast-body">
                            See? Just like this.
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div> */}
                {notifications.map((config, i) => <AppToast color={config.variant} text={config.text} key={Math.random().toString(16).slice(2)}></AppToast>)}
                
            </div>
        </div>
    )
};


export default AppNotifications;