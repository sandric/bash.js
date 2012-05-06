<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>HALLO BABY</title>

    <style type = "text/css">
        .cursor
        {
            width: 10px;
            height: 20px;

            background-color: #6a9211;

            float:left;
        }

        .cmd
        {
            float: left;
        }

        .navigator
        {

            position:relative;

            z-index: 1;

            background-color: black;
            overflow:hidden;
            font-size: 12pt;

            padding: 5px;
            font-family: monospace, prestige;

            font-weight: bold;

            cursor: pointer;

            opacity: 0.5;
        }

        .input_wrapper
        {
            float: left;
            margin-top: -2.5px;
        }

        #visibleInput
        {
            color: green;
            float: left;
        }

        #cmd_input
        {
            font-size: small;
            width: 20px;
            height: 10px;
            background-color: white;
            color:white;
            border: none;

            position:absolute;
            top: 10;
            z-index: 0;

        }

        #cmd_input:focus
        {
            outline: none;
        }

        .cmd_output
        {
            color: #D3D3D3;
        }

        .cursor
        {
            width: 9px;
            height: 18px;
            background-color: green;
            margin-left: 2px;
        }

        li
        {
            list-style: none;
        }

    </style>

</head>
<body>

<div style="">
    <input id = "cmd_input" type = "text" value = "1"/>
</div>

<div class = "navigator">

    <div class = "cmd_output">
        available commands: pwd, ls, cd, sendmail, man. For command usage - type "man 'command'"
    </div>


    <div class = "cmd">
        <span style = "color: #08C">guest</span><span style = "color: green"><b>@</b></span><span style = "color: coral">sandric.com</span><span style = "color: green">:</span><span id = "currentPage" style = "color: #08C">/interests</span><span style="color: green">$&nbsp</span>
    </div>

    <div id = "visibleInput"></div>

    <div class = "cursor">&nbsp</div>

</div>

<div style = "clear:both"></div>

<div id="content">
</div>

</body>
</html>
