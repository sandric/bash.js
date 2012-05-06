$(document).ready(function(){

    function extend(Child, Parent)
    {

        var F = function(){}
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    }


    function CCommand(name, output, printOutputCallback)
    {
        this.name = name;
        this.output = output;
        this.printOutputCallback = printOutputCallback;
    }
    CCommand.prototype.isCommand = function(input)
    {
        if(this.name == input)
            return true;
        else
            return false;
    }
    CCommand.prototype.printOutput = function()
    {
        this.printOutputCallback(this.output);
    }
    CCommand.prototype.runAction = function()
    {
        this.printOutput();
    }

    extend(CCDCommand, CCommand);
    function CCDCommand(name, output, printOutputCallback, setCurrentPageCallback, redirect)
    {
        CCDCommand.superclass.constructor.apply(this, arguments);
        this.redirect = redirect;
        this.setCurrentPageCallback = setCurrentPageCallback;
    }
    CCDCommand.prototype.runAction = function()
    {
        CCDCommand.superclass.runAction.apply(this, arguments);
        this.setCurrentPageCallback.call(myNavigator, this.redirect);
    }

    extend(CLSCommand, CCommand);
    function CLSCommand(name, output, printOutputCallback, pages)
    {
        CLSCommand.superclass.constructor.apply(this, arguments);
        this.pages = pages;
        this.printOutputCallback = printOutputCallback;
    }
    CLSCommand.prototype.printOutput = function()
    {
        var pagesStr = "";
        for(var page in this.pages)
        {
            pagesStr += page + " ";
        }

        this.printOutputCallback(pagesStr);
    }

    extend(CPWDCommand, CCommand);
    function CPWDCommand(name, output, printOutputCallback, currentPageInfo)
    {
        CPWDCommand.superclass.constructor.apply(this, arguments);
        this.printOutputCallback = printOutputCallback;
        this.currentPageInfo = currentPageInfo;
    }
    CPWDCommand.prototype.printOutput = function()
    {
        var pageInfoStr = this.currentPageInfo.call(myNavigator);
        this.printOutputCallback(pageInfoStr);
    }


    function CNavigator(pages)
    {

        this.pages = pages;
        this.commands = [];
        this.currentPage = "aboutMe";
    }

    CNavigator.prototype.registerCommands = function()
    {

        this.commands.push(new CCommand("man", "available commands: pwd, ls, cd, sendmail, man. For command usage - type \"man \"command\"\"", this.printOutput));
        this.commands.push(new CCommand("man man", "shows command usage. Usage - man \"command\"", this.printOutput ));
        this.commands.push(new CCommand("man pwd", "shows current page info. Usage - pwd", this.printOutput));
        this.commands.push(new CCommand("man ls", "show all pages. Usage - ls", this.printOutput));
        this.commands.push(new CCommand("man sendmail", "send me mail. Usage - sendmail", this.printOutput));
        this.commands.push(new CCommand("man cd", "go to page. Usage - cd \"page_name\"" , this.printOutput));
        this.commands.push(new CCommand("sendmail", "sending mail" , this.printOutput));
        this.commands.push(new CPWDCommand("pwd", "info about page", this.printOutput, this.getCurrentPageInfo));
        this.commands.push(new CLSCommand("ls", "", this.printOutput, this.pages));
        this.commands.push(new CCDCommand("cd aboutMe", "going to aboutMe.php, wait...", this.printOutput, this.setCurrentPage, "aboutMe"));
        this.commands.push(new CCDCommand("cd interests", "going to interests.php, wait...", this.printOutput, this.setCurrentPage, "interests"));
        this.commands.push(new CCDCommand("cd projects", "going to projects.php, wait...", this.printOutput, this.setCurrentPage, "projects"));
        this.commands.push(new CCDCommand("cd contacts", "going to contacts.php, wait...", this.printOutput, this.setCurrentPage, "contacts"));
    }

    CNavigator.prototype.getInput = function()
    {
        return $("#visibleInput").html();
    }

    CNavigator.prototype.printOutput = function(output)
    {
        $(".cmd_output").html(output);
    }

    CNavigator.prototype.setCurrentPage = function(newPage)
    {
        this.currentPage = newPage;
        $("#currentPage").html(this.currentPage);
        $.post( "index.php?r=site/" + newPage,
                function(data)
                {
                    $("#content").html($(data).find("#content"));
                    CNavigator.prototype.printOutput("You are in "+ newPage + " now");
                }
        );
    }

    CNavigator.prototype.getCurrentPageInfo = function()
    {
        for(var page in this.pages)
        {
            if(page == this.currentPage)
                return this.pages[page].info;
        }
    }

    CNavigator.prototype.parseCommand = function()
    {
        var input = this.getInput();
        for(var command in this.commands)
        {
            if(this.commands[command].name == input)
            {
                this.commands[command].runAction();
                return;
            }
        }
        this.printOutput("Unknown command. Type man for command usage help");
    }

    CNavigator.prototype.registerEvents = function()
    {
        var that = this;
        $('#cmd_input').keyup(function(event) {
            if (event.which == 13) {
                that.parseCommand();
                $("#visibleInput").html("");
                $("#cmd_input").val("");
            }
            else
                $("#visibleInput").html($("#cmd_input").val());
        });


        $(".navigator").click(function()
        {
            $(this).fadeTo("fast", 1.0, function(){});
            $("#cmd_input").focus();
        });

        $("#cmd_input").blur(function()
        {
            $(".navigator").fadeTo("fast", 0.5, function(){});
        });
    }

    CNavigator.prototype.initialiseEntity = function()
    {
        this.registerCommands();
        this.registerEvents();

        this.setCurrentPage(this.currentPage);
    }

    var myNavigator = new CNavigator({
                                        "aboutMe": { redirect: "aboutMe", info: "some interesting info about Me"},
                                        "interests": { redirect: "interests", info: "some interesting info about my interests"},
                                        "projects": { redirect: "projects", info: "some interesting info about my projects"},
                                        "contacts": { redirect: "contacts", info: "some interesting info about contacts"}
                                      });
    myNavigator.initialiseEntity();
});