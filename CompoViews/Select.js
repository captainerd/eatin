import React, { useState, useEffect, getDefaultProps } from 'react';

function convertUtfGreekLish(s) {


    for (let i = 0; i <= s.length; i++) {

        s = str_replace('Θ', 'TH', s);
        s = str_replace('Ψ', 'PS', s);
        s = str_replace('Ξ', 'KS', s);
        s = str_replace('Σ', 'S', s);
        s = str_replace('Ε', 'E', s);
        s = str_replace('Έ', 'E', s);
        s = str_replace('Ρ', 'R', s);
        s = str_replace('Τ', 'T', s);
        s = str_replace('Υ', 'U', s);
        s = str_replace('Ύ', 'U', s);
        s = str_replace('Ι', 'I', s);
        s = str_replace('Ί', 'I', s);
        s = str_replace('Ο', 'O', s);
        s = str_replace('Ό', 'O', s);
        s = str_replace('Π', 'P', s);
        s = str_replace('Α', 'A', s);
        s = str_replace('Ά', 'A', s);
        s = str_replace('Δ', 'D', s);
        s = str_replace('Φ', 'F', s);
        s = str_replace('Γ', 'G', s);
        s = str_replace('Η', 'I', s);
        s = str_replace('Ή', 'I', s);
        s = str_replace('Κ', 'K', s);
        s = str_replace('Λ', 'L', s);
        s = str_replace('Z', 'Ζ', s);
        s = str_replace('Χ', 'X', s);
        s = str_replace('Ω', 'O', s);
        s = str_replace('Ώ', 'O', s);
        s = str_replace('Β', 'V', s);
        s = str_replace('Ν', 'N', s);
        s = str_replace('Μ', 'M', s);
        s = str_replace('θ', 'th', s);
        s = str_replace('ψ', 'ps', s);
        s = str_replace('ξ', 'ks', s);
        s = str_replace('σ', 's', s);
        s = str_replace('ε', 'e', s);
        s = str_replace('έ', 'e', s);
        s = str_replace('ρ', 'r', s);
        s = str_replace('τ', 't', s);
        s = str_replace('υ', 'y', s);
        s = str_replace('ύ', 'y', s);
        s = str_replace('ι', 'i', s);
        s = str_replace('ί', 'i', s);
        s = str_replace('ο', 'o', s);
        s = str_replace('ό', 'o', s);
        s = str_replace('π', 'p', s);
        s = str_replace('α', 'a', s);
        s = str_replace('ά', 'a', s);
        s = str_replace('δ', 'd', s);
        s = str_replace('φ', 'f', s);
        s = str_replace('γ', 'g', s);
        s = str_replace('η', 'i', s);
        s = str_replace('ή', 'i', s);
        s = str_replace('κ', 'k', s);
        s = str_replace('λ', 'l', s);
        s = str_replace('ζ', 'z', s);
        s = str_replace('χ', 'x', s);
        s = str_replace('ω', 'o', s);
        s = str_replace('ώ', 'o', s);
        s = str_replace('β', 'v', s);
        s = str_replace('ν', 'n', s);
        s = str_replace('μ', 'm', s);
    }
    return s;
}
function str_replace(s, f, r) {
    return r.replace(s, f)
}
var menuOpen = false;
function Select(props) {



    const [options, setOptions] = useState([]);
    const [isinvalidlabel, setIsinvalidlabel] = useState('');
    const [isinvalidInput, setIsinvalidinput] = useState('');
    const [isfocused, setIsfocused] = useState('');
    const [isdirty, setIsdirty] = useState('');
    const [hasimage, setHasimage] = useState('');
    const handleOption = (e) => {

        HideMenu();
        options.map(item => {

            if (item.id === e.target.getAttribute("data-id") && typeof item.img !== 'undefined') {
                document.getElementById(props.id).style.width = '1px';
                setHasimage(item.img);
            }
        });

        let lang = JSON.parse(window.localStorage.getItem('user')).lang

        if (lang == 'gr') document.getElementById(props.id).value = e.target.getAttribute("data-text");
        if (lang == 'en') document.getElementById(props.id).value = convertUtfGreekLish(e.target.getAttribute("data-text"));


        if (document.getElementById(props.id).value.length === 0) {
            setIsdirty('');
        } else {
            setIsdirty(' is-dirty ');
        }

        //alert(e.target.parentElement.parentElement.className);

        //        setEmpty("has-placeholder");
        if (typeof props.onSelect === 'function') {
            let myObj = {
                id: e.target.getAttribute("data-id"),
                label: e.target.getAttribute("data-text"),
            }
            props.onSelect(myObj);


        }

    }
    const ToggleMenu = () => {

        if (menuOpen) {

            HideMenu();;
        } else {
            ShowMenu();
        }
    }
    const handleBlur = (e) => {
        setIsfocused('');
        HideMenu();

    }
    const ShowMenu = () => {

        if (typeof options === 'undefined') return;
        if (options === null) {

            return;
        }
        setIsfocused(' is-focused  ');
        setIsdirty(' is-dirty ');
        if (options.length > 5) {
            document.getElementById(props.id + 'div').style.height = '200px';
            document.getElementById(props.id + 'div').style.overflowY = 'scroll';

        } else {
            document.getElementById(props.id + 'div').style.height = 'auto';
            document.getElementById(props.id + 'div').style.overflowY = 'hidden';
        }
        document.getElementById(props.id + 'div').style.opacity = '1';
        document.getElementById(props.id + 'div').style.maxHeight = '320px';
        document.getElementById(props.id + 'div').style.zIndex = "1000";
        menuOpen = true;
    }
    const HideMenu = () => {


        if (document.getElementById(props.id).value.length === 0) setIsdirty(' ');
        setIsfocused(' ');
        document.getElementById(props.id + 'div').style.maxHeight = '0px';

        setTimeout(() => {
            if (document.getElementById(props.id + 'div')) {
                document.getElementById(props.id + 'div').style.zIndex = "-1";
                document.getElementById(props.id + 'div').style.opacity = '0';
            }
        }, 400);
        menuOpen = false;
    }

    const handleClick = (e) => {

        ShowMenu();
    }
    const handleChange = (e) => {


        if (typeof props.onChange === 'function') {
            props.onChange(e);

        }

        if (document.getElementById(props.id).value.length === 0) {
            setIsdirty('');
        } else {
            setIsdirty(' is-dirty ');
        }
        ShowMenu();

    }
    useEffect(() => {
        // if (props.autocomplete !== true) document.getElementById(props.id).value = '';
        setOptions(props.options);





    }, [props.options]);

    useEffect(() => {

        if (typeof props.defaultValue !== 'undefined') {
              document.getElementById(props.id).value = props.defaultValue;
            let lang = JSON.parse(window.localStorage.getItem('user')).lang
            if (lang == 'gr') document.getElementById(props.id).value = props.defaultValue;
            if (lang == 'en') document.getElementById(props.id).value = convertUtfGreekLish(props.defaultValue);

            setIsdirty(' is-dirty ');
        }



    }, [props.defaultValue]);





    useEffect(() => {

        if (props.isinvalid !== false && typeof props.isinvalid !== 'undefined') {

            setIsinvalidlabel(' is-dirty invalidlabel  ');
            setIsinvalidinput(props.isinvalid);


        } else {
            setIsinvalidlabel('  ');
            setIsinvalidinput('');


        }
    }, [props.isinvalid]);
    useEffect(() => {

        if (typeof props.id === 'undefined') props.id = 'sel_id' + Math.floor(Math.random() * (50000000 - 20000000)) + 200000;

        if (Array.isArray(props.options)) props.options.map(function (item) {
            if (document.getElementById(props.id) && item.default === true && document.getElementById(props.id).value === '') {
                document.getElementById(props.id).value = item.label;
                let lang = JSON.parse(window.localStorage.getItem('user')).lang
                if (lang == 'gr') document.getElementById(props.id).value = item.label;
                if (lang == 'en') document.getElementById(props.id).value = convertUtfGreekLish(item.label);


                setIsdirty(' is-dirty ');

            }
            if (document.getElementById(item.id) !== null) document.getElementById(item.id).style.opacity = "1";
        });



    });
    return (

        <div className={isinvalidlabel + " mdl-select-input " + props.className} style={props.style} >
            {props.icon !== 'hide' ? (<i htmlFor={props.id} className={" 	 	mdl-color-text--primary  mdl-sel-icon material-icons mdl-textfield__icon "}>{props.icon}</i>) : ('')}
            < div className={isdirty + isfocused + isinvalidlabel + " mdl-textfield  mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height "}>

                <input style={props.inputstyle} autoComplete='off' onBlur={handleBlur} type="text" onClick={handleClick} readOnly={props.readOnly} onChange={handleChange} className="mdl-textfield__input " id={props.id} />
                {hasimage.length > 0 && <i htmlFor={props.id} className={"mdl-sel-icon material-icons mdl-textfield__icon "}><img onClick={handleClick} style={{ width: '25px', height: '25px', cursor: 'pointer' }} src={hasimage} /> </i>}
                <i onClick={ToggleMenu} className=" mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                <label id={props.id + 'i'} htmlFor={props.id} className={"mdl-textfield__label"}>{props.label}</label>
                <div style={props.style} onClick={handleOption} id={props.id + 'div'} className="mdl-autoselect">

                    {Array.isArray(options) && options.map(item => (
                        <span style={props.menustyle} data-text={item.label} data-id={item.id} key={item.id} style={{ opacity: '1' }} className="mdl-menu__item" >
                            {props.showGoogle && (<i data-id={item.id} data-text={item.label} className="mdl-textfield--floating-label material-icons icon_autocomplete">where_to_vote</i>)}
                            {typeof item.img !== 'undefined' && <img data-text={item.label} data-id={item.id} src={item.img} />}

                            {JSON.parse(window.localStorage.getItem('user')).lang === 'gr' ? <>{item.label}</> :
                                <>{convertUtfGreekLish(item.label)}</>

                            }
                        </span>
                    ))}
                    {props.showGoogle && (<img id="pgoogle" src="/images/powered_by_google_on_white.png" />)}


                </div>
                <span className="mdl-textfield__error">{isinvalidInput}</span>
            </div ></div>
    );
}

export default Select;