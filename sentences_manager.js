(function() {
    window.corpus = [
        "quelle belle journee",
        "le ciel est bleu",
        "la terre est plate",
        "si je rempli mon verre il sera rempli",
        "je crois que le belvedere est de travers",
        "le rugby est un sport d equipe",
        "attention a la marche en descendant du train",
        "il est indubitablement grand",
        "justifiez votre acte",
        "trouver le chemin vers le village",
        "dormez paisiblement en cette belle nuit",
        "obtemperez ou mourrez",
        "la glace a la vanille est le meilleur choix",
        "publiez cet article sur le journal",
        "le destin de cet insecte est tout trace",
        "voulez vous dormir sur le canape",
        "melanger le sucre et la farine",
        "quelle delicieuse journee",
        "la poule est un animal diurne",
        "sans desespoir il n'y a pas d espoir",
        "les humains sont nes dans le feu",
        "produire du lait de maniere massive",
        "l enfer c est les autres",
        "j aime les compotes de pommes",
        "votre point de vue est legitime",
        "detruire et creer sont des principes lies",
        "ce n est qu une question de temps",
        "vous avez une superbe memoire",
        "mangerez vous du choux",
        "cinq cents ans apres il garde son eclat",
        "je suis subjugue par cette paire de chaussures",
        "klaxonner dans un embouteillage est inutile",
        "former les bataillons",
        "exercer un grand ascendant sur quelqu un",
        "qualifie un courant d air qui se dirige vers le haut",
        "un astre au dessus de l horizon"
    ];
    window.LetterColorEnum = Object.freeze({NEUTRAL: "#0b559b", CORRECT: "#0B610B", ERROR: "#B40404"});
}());
(function () {
    $.widget("manager.sentences_manager", {
        options: {

        },
        _create: function() {
            this.addNewSentence();
            this._refresh();
        },
        _refresh: function () {
            this.element.empty();
            for(var i = 0; i<this.sentence.length; i++) {
                var currentLetter = this.sentence[i];
                this.element.append('<span style="color: '+currentLetter.color+';">'+currentLetter.letter+'</span>');
            }
        },
        addNewSentence: function () {
            this.letterIndex = 0;
            this.sentence = [];
            var selectedSentence = corpus[Math.floor(Math.random() * Math.floor(corpus.length))];
            for(var i = 0; i<selectedSentence.length; i++) {
                this.sentence.push({letter: selectedSentence[i], color: LetterColorEnum.NEUTRAL});
            }
        },
        receiveNewLetter: function (key) {
            switch (key){
                case "delete":
                    this.removeLetter();
                    break;

                case "enter":
                    this.endSentence();
                    break;

                default:
                    this.addLetter(key);
            }
        },
        removeLetter: function () {
            if (this.letterIndex === 0) return;
            this.letterIndex--;
            this.sentence[this.letterIndex].color = LetterColorEnum.NEUTRAL;
            this._refresh();
        },
        endSentence: function () {
            var endSentenceEvent = jQuery.Event("sentence_finished");
            this.element.trigger(endSentenceEvent);
            this.addNewSentence();
            this._refresh();
        },
        addLetter: function (letter) {
            if (this.letterIndex === this.sentence.length){
                return;
            }
            this.sentence[this.letterIndex].color = (letter === this.sentence[this.letterIndex].letter) ?
                LetterColorEnum.CORRECT : LetterColorEnum.ERROR;
            this.letterIndex++;
            this._refresh();
        }
    });
}());

