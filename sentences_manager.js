(function() {
    window.corpus = [
        "quelle belle journee",
        "le ciel est bleu",
        "la terre est plate",
        "si je rempli mon verre il sera rempli",
        "je crois que le belvedere est de travers",
        "le rugby est un sport d equipe",
        "attention a la marche en descendant du train"
    ];
    window.LetterColorEnum = Object.freeze({NEUTRAL: "#0b559b", CORRECT: "#0B610B", ERROR: "#B40404"});
}());
(function () {
    $.widget("manager.sentences_manager", {
        options: {

        },
        _create: function() {
            this.container = this.element;
            this.addNewSentence();
            this._refresh();
        },
        _refresh: function () {
            this.container.empty();
            for(var i = 0; i<this.sentence.length; i++) {
                var currentLetter = this.sentence[i];
                this.container.append('<span style="color: '+currentLetter.color+';">'+currentLetter.letter+'</span>');
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
        receiveNewLetter: function (letter) {
            this.sentence[this.letterIndex].color = (letter === this.sentence[this.letterIndex].letter) ?
                LetterColorEnum.CORRECT : LetterColorEnum.ERROR;
            this.letterIndex++;
            this._refresh();
            // TODO : enter to switch sentence
            if (this.letterIndex === this.sentence.length){
                //TODO:clear textbox
                this.addNewSentence();
                this._refresh();
            }
        },
        removeLetter: function () {
            if (this.letterIndex === 0) return;
            this.letterIndex--;
            this.sentence[this.letterIndex].color = LetterColorEnum.NEUTRAL;
            this._refresh();
        }
    });
}());

