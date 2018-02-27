(function () {
    var LetterColorEnum = Object.freeze({NEUTRAL: "#0b559b", CORRECT: "#0B610B", ERROR: "#B40404"});
    $.widget("manager.sentences_manager", {
        options: {
            filename: "result.txt"
        },
        _create: function() {
            this.keyStroke = 0;
            this.nCharacters = 0;
            this.nWords = 0;
            this.nSentences = 0;
            this.meanStringDistanceAcc = 0;
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
            this.sentence = [];
            this.selectedSentence = corpus[Math.floor(Math.random() * Math.floor(corpus.length))];
            for(var i = 0; i < this.selectedSentence.length; i++) {
                this.sentence.push({letter: this.selectedSentence[i], color: LetterColorEnum.NEUTRAL});
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
            this.typedText = this.typedText.slice(0, -1);
            this.keyStroke++;
        },
        endSentence: function () {
            this.updateStat(false);
            var endSentenceEvent = jQuery.Event("sentence_finished");
            this.element.trigger(endSentenceEvent);
            this.addNewSentence();
            this._refresh();
        },
        updateStat: function (lastSentence) {
            this.nCharacters += this.typedText.length;
            this.nWords += this.typedText.length === 0 ? 0 : this.typedText.split(" ").length;
            if (!lastSentence){
                this.nSentences++;
                this.meanStringDistanceAcc +=
                    this.getEditDistance(this.typedText, this.selectedSentence) /
                    Math.max(this.typedText.length, this.selectedSentence.length);
            }
            this.typedText = "";
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
            this.updateStat(true);
            var nMinute = time/1000/60;
            var kspc = this.nCharacters === 0 ? 0 : this.keyStroke / this.nCharacters;
            var wpm = this.nWords / nMinute;
            var msd = this.nSentences === 0 ? 0 : this.meanStringDistanceAcc / this.nSentences;
            window.location.href = window.location.href.replace(/.+_test/,
                "save_result?kspc="+kspc+"&wpm="+wpm+"&msd="+msd+"&filename="+this.options.filename);
        },
        getEditDistance: function(a, b) {
            if (a.length === 0) return b.length;
            if (b.length === 0) return a.length;

            var matrix = [];

            // increment along the first column of each row
            var i;
            for (i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }

            // increment each column in the first row
            var j;
            for (j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }

            // Fill in the rest of the matrix
            for (i = 1; i <= b.length; i++) {
                for (j = 1; j <= a.length; j++) {
                    if (b.charAt(i-1) === a.charAt(j-1)) {
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                            Math.min(matrix[i][j-1] + 1, // insertion
                                matrix[i-1][j] + 1)); // deletion
                    }
                }
            }

            return matrix[b.length][a.length];
        }
    });
}());

