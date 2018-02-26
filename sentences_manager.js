(function () {
    var LetterColorEnum = Object.freeze({NEUTRAL: "#0b559b", CORRECT: "#0B610B", ERROR: "#B40404"});
    $.widget("manager.sentences_manager", {
        options: {

        },
        _create: function() {
            this.keyStroke = 0;
            this.nCharacters = 0;
            this.nWords = 0;
            this.typedText = "";
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
            // this.letterIndex = 0;
            this.typedText = "";
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
            // if (this.letterIndex === 0) return;
            // this.letterIndex--;
            // this.sentence[this.letterIndex].color = LetterColorEnum.NEUTRAL;
            // this._refresh();
            this.typedText.slice(0, -1);
            this.keyStroke++;
        },
        endSentence: function () {
            this.updateStat();
            var endSentenceEvent = jQuery.Event("sentence_finished");
            this.element.trigger(endSentenceEvent);
            this.addNewSentence();
            this._refresh();
            //TODO check distance de levenshtein pour MSD
        },
        updateStat: function () {
            this.nCharacters += this.typedText.length;
            this.nWords += this.typedText.split(" ").length;
        },
        addLetter: function (letter) {
            // if (this.letterIndex === this.sentence.length){
            //     return;
            // }
            // this.sentence[this.letterIndex].color = (letter === this.sentence[this.letterIndex].letter) ?
            //     LetterColorEnum.CORRECT : LetterColorEnum.ERROR;
            // this.letterIndex++;
            // this._refresh();
            this.typedText += letter;
            this.keyStroke++;
        },
        endTest: function (time) {
            this.updateStat();
            var nMinute = time/1000/60;
            var kspc = this.nCharacters === 0 ? 0 : this.keyStroke / this.nCharacters;
            var wpm = this.nWords / nMinute;
            window.location.href = "http://localhost:8000/save_result?kspc="+kspc+"&wpm="+wpm;
        }
    });
}());

