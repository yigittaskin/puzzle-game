const pieces = document.querySelectorAll('.piece');
const fullPuzzle = document.querySelector('.full-puzzle');
var countDiv = document.getElementById('count');
var countCongrat = document.getElementById('countCongrat');
var usernameInput = document.getElementById('username');
let firstClick = null;
let count = 0;
let username;

// Yüklenen resmi 16 parçaya bölme
const uploadImage = document.getElementById("uploadImage");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");

uploadImage.addEventListener("change", function () {
  const dosya = this.files[0];
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    const puzzleImage = e.target.result;
    // Resim elemanını seçin ve canvas'a yükleyin
    const image = new Image();
    image.src = puzzleImage;
    console.log(image);

    // Resmi yükleyin ve boyutlarını kontrol edin
    image.onload = () => {
      const imgWidth = image.width;
      const imgHeight = image.height;
      if (imgWidth > 600 || imgHeight > 600) {
        alert('Önerilen boyut: 600x600.... Yine de devam etmek ister misiniz?');
      }

      // Canvas boyutlarını ayarlayın
      canvas.width = 600;
      canvas.height = 600;

      // Resmi canvas'a çizin
      ctx.drawImage(image, 0, 0, 600, 600);
      fullPuzzle.style.backgroundImage = `url(${canvas.toDataURL()})`;

      // Her bir parça için img etiketini güncelleyin
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];

        // Parça koordinatlarını hesaplayın
        const x = i % 4;
        const y = Math.floor(i / 4);
        const backgroundPositionX = -x * 146;
        const backgroundPositionY = -y * 146;

        // img etiketinin stil özelliklerini ayarlayın
        piece.style.width = '146px';
        piece.style.height = '146px';
        piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
        piece.style.backgroundPosition = `${backgroundPositionX}px ${backgroundPositionY}px`;
      }
    };
  }

  fileReader.readAsDataURL(dosya);
});


// Bağlı Liste oluşturulması
pieces.forEach((piece) => {
  piece.prev = null;
  piece.next = null;

  pieces.forEach((otherPiece) => {
    if (
      otherPiece !== piece &&
      (
        otherPiece.style.top === piece.style.top &&
        (
          otherPiece.style.left === piece.style.left + '150px' ||
          otherPiece.style.left === piece.style.left - '150px'
        )
      ) ||
      (
        otherPiece.style.left === piece.style.left &&
        (
          otherPiece.style.top === piece.style.top + '150px' ||
          otherPiece.style.top === piece.style.top - '150px'
        )
      )
    ) {
      if (!piece.next) {
        piece.next = otherPiece;
      } else if (!piece.prev) {
        piece.prev = otherPiece;
      }
    }
  });
});

// Puzzle parçalarının karıştırılması
function shuffle() {
  const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  let currentIndex = indexes.length - 1;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = indexes[currentIndex];
    indexes[currentIndex] = indexes[randomIndex];
    indexes[randomIndex] = temporaryValue;
  }

  pieces.forEach((piece, index) => {
    piece.style.top = Math.floor(indexes[index] / 4) * 150 + 'px';
    piece.style.left = (indexes[index] % 4) * 150 + 'px';
  });
}

shuffle();

// Puzzle parçalarının hareket ettirilmesi
function swapPieces(piece) {

  if (firstClick === null) {
    // İlk tıklanan parçaya class ve parça atanması
    firstClick = piece;
    firstClick.classList.add("selected");
  } else {
    // 2.tıklanan parça ve yer değiştirme
    const tempPrev = piece.prev;
    const tempNext = piece.next;
    piece.prev = firstClick.prev;
    piece.next = firstClick.next;
    firstClick.prev = tempPrev;
    firstClick.next = tempNext;

    if (firstClick.prev) {
      firstClick.prev.next = firstClick;
    }
    if (firstClick.next) {
      firstClick.next.prev = firstClick;
    }
    if (piece.prev) {
      piece.prev.next = piece;
    }
    if (piece.next) {
      piece.next.prev = piece;
    }
    // Parçaların konumlarını değiştirme
    const tempTop = piece.style.top;
    const tempLeft = piece.style.left;
    piece.style.top = firstClick.style.top;
    piece.style.left = firstClick.style.left;
    firstClick.style.top = tempTop;
    firstClick.style.left = tempLeft;

    // İlk tıklamayı resetleme
    firstClick.classList.remove("selected");
    firstClick = null;

    // Hamle sayısını arttırma ve yazdırma
    count++;
    printCount();

    // Puzzle doğruluğunun kontrolü
    checkIfSolved();
  }
}

// Hamle sayısını yazdırma
function printCount() {
  countDiv.innerHTML = `Count: ${count}`;
  countCongrat.innerHTML = `Count: ${count}`;
}

// Puzzle doğruluğunun kontrolü
function checkIfSolved() {
  var checkSort = "";
  let isSolved = false;
  pieces.forEach((piece, index) => {
    const left = parseInt(piece.style.left);
    const top = parseInt(piece.style.top);
    checkSort += `${left},${top},`;
    const correctSort = "0,0,150,0,300,0,450,0,0,150,150,150,300,150,450,150,0,300,150,300,300,300,450,300,0,450,150,450,300,450,450,450,";
    // Puzzle sıralamasının doğru olup olmadığının kontrolü
    if (correctSort == checkSort) {
      isSolved = true;
    }
  });
  if (isSolved) {
    // Puzzle çözüldüğünde
    setTimeout(openFullscreenAlert, 300);
  }
}

function openFullscreenAlert() {
  document.getElementById("fullscreen-alert").style.display = "block";
}

function closeFullscreenAlert() {
  document.getElementById("fullscreen-alert").style.display = "none";

  if (usernameInput.value) {
    document.getElementById("fullscreen-alert-user").style.display = "none";
    username = usernameInput.value;
    document.querySelector('.user').innerHTML = username;
  }
  else {
    usernameInput.style.border = "1px solid red";
  }

  count = 0;
  printCount();
  shuffle();
}

// Puzzle parçalarının yer değiştirmesini tetikleme
pieces.forEach((piece) => {
  piece.addEventListener('click', () => {
    swapPieces(piece);
  });
});

// Puzzle parçalarını karıştırma
const shuffleButton = document.getElementById('shuffle');
shuffleButton.addEventListener('click', () => {
  shuffle();
});
