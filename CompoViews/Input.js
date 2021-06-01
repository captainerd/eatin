import React from 'react';

//input na pernei invalid class


//props= icon, type, id, text, isinvalid=true/false
class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mataki: false,
            typepass: 'password',
            invalidlabel: ' ',
            invalidinput: ' ',

        };

    }



    componentDidUpdate(prevProps, prevState) {



        if (prevState.invalidinput !== this.props.invalidinput) {

            //alert(this.props.isinvalid);

        }

        if (prevProps.isinvalid !== this.props.isinvalid) {

            if (this.props.isinvalid !== false) {

                this.setState({
                    invalidlabel: ' is-dirty invalidlabel  ',
                    invalidinput: this.props.isinvalid,
                });

            } else {
                this.setState({
                    invalidlabel: ' is-dirty ',
                    invalidinput: '',
                });

            }

        }
        return null;
    }

    handleOnChange = (e) => {

        if (typeof this.props.onChange === 'function') {

            this.props.onChange(e);
        }
        if (typeof this.props.onClick === 'function') {

            this.props.onClick(e);
        }
    }
    paremati = () => {



        this.setState({
            mataki: !this.state.mataki,
        });
        if (this.state.typepass === 'password') {
            this.setState({
                typepass: 'text',
            });
        } else {
            this.setState({
                typepass: 'password',
            });
        }

    }
    handleKeyDown = (e) => {
        if (typeof this.props.onKeyDown === 'function') {

            this.props.onKeyDown(e);
        }
    }
    HandleBlur = (e) => {
        if (typeof this.props.onBlur === 'function') {

            this.props.onBlur(e);
        }
    }

    render() {

        if (this.props.type === "number") {
            return (<>

                <div key={this.props.defaultValue} style={this.props.style} className={this.state.invalidlabel + " mdl-textfield mdl-js-textfield mdl-textfield--floating-label "}>
                    {this.props.icon !== 'hide' ? (<i className={" 	mdl-color-text--primary material-icons mdl-textfield__icon " + this.state.invalidlabel}>{this.props.icon}</i>) : ('')}
                    <input onBlur={this.HandleBlur} onKeyDown={this.handleKeyDown} autoComplete={this.props.autocomplete} onClick={this.handleOnChange} onKeyUp={this.handleOnChange} pattern="-?[0-9]*(\.[0-9]+)?" defaultValue={this.props.defeaultValue} placeholder={this.props.placeholder} className={"  mdl-textfield__input"} max={this.props.max} min={this.props.min} type={this.props.type} id={this.props.id} value={this.props.value} />
                    <label className={'mdl-textfield__label '} htmlFor={this.props.id}>{this.props.text}</label>
                    <span className="mdl-textfield__error">{this.state.invalidinput}</span>
                </div>

            </>);
        }
        if (this.props.type === "password" || this.props.type === "text") {
            return (<>

                <div key={this.props.defaultValue} style={this.props.style} className={this.state.invalidlabel + "mdl-textfield mdl-js-textfield mdl-textfield--floating-label "}>
                    {this.props.icon !== 'hide' ? (<i className={" 	mdl-color-text--primary material-icons mdl-textfield__icon "}>{this.props.icon}</i>) : ('')}
                    <input readonly={this.props.readonly} onBlur={this.HandleBlur} onKeyDown={this.handleKeyDown} autoComplete={this.props.autocomplete} defaultValue={this.props.defaultValue} onClick={this.handleOnChange} onChange={this.handleOnChange} placeholder={this.props.placeholder} className={"noplacehl mdl-textfield__input "} type={this.props.type} id={this.props.id} value={this.props.value} />
                    <label className={'mdl-textfield__label '} htmlFor={this.props.id}>{this.props.text}</label>
                    <span className="mdl-textfield__error">{this.state.invalidinput}</span>
                </div>

            </>);
        }

        if (this.props.type === "passwordWithEye") {
            return (<>
                <div key={this.props.defaultValue} style={this.props.style} className={this.state.invalidlabel + "mdl-textfield mdl-js-textfield mdl-textfield--floating-label "}>
                    <i className={"	mdl-color-text--primary material-icons mdl-textfield__icon " + this.state.invalidlabel} htmlFor={this.props.id}>{this.props.icon}</i>
                    <input onBlur={this.HandleBlur} onKeyDown={this.handleKeyDown} onClick={this.handleOnChange} onChange={this.handleOnChange} defaultValue={this.props.defaultValue} className={"mdl-textfield__input "} type={this.state.typepass} id={this.props.id} value={this.props.value} />
                    <label className={"mdl-textfield__label "} htmlFor={this.props.id}>{this.props.text}</label>
                    <i className={this.state.mataki ? "	mdl-color-text--primary material-icons mdl-textfield__icon2 mdl-textfield_icon_erased 	mdl-color-text--primary " : " material-icons mdl-textfield__icon2 	mdl-color-text--primary "} onClick={this.paremati} htmlFor="rpassword">remove_red_eye</i>
                    <span className="mdl-textfield__error">{this.state.invalidinput}</span>
                </div>


            </>);
        }
        if (this.props.type === "toggle") {
            return (<>
                <div key={this.props.defaultValue} style={this.props.style} className={this.state.invalidlabel + this.props.className + " mdl-textfield mdl-js-textfield mdl-textfield--floating-label "}>
                    <label style={{ marginLeft: '30px' }} className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor={this.props.id} id={this.props.id + 'label'}>
                        <input defaultChecked={this.props.defaultValue} onClick={this.handleOnChange} onChange={this.handleOnChange} type="checkbox" id={this.props.id} className="mdl-switch__input" />
                        <span style={{ left: '50px', position: 'absolute' }}  >{this.props.text}</span>
                    </label>
                </div>
            </>);
        }

        if (this.props.type === "checkbox") {
            return (<>

                <label style={this.props.style} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={this.props.id}>
                    <input disabled={this.props.disabled} defaultChecked={this.props.defaultChecked} onClick={this.handleOnChange} onChange={this.handleOnChange} type="checkbox" id={this.props.id} className="mdl-checkbox__input" />
                    <span className="mdl-checkbox__label">{this.props.text}</span>
                </label>
            </>);
        }


    }
}

export default Input;
