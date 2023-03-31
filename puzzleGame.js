const pieces = document.querySelectorAll('.piece');
const fullPuzzle = document.querySelector('.full-puzzle');
var countDiv = document.getElementById('count');
var countCongrat = document.getElementById('countCongrat');
var usernameInput = document.getElementById('username');
let firstClick = null;
let count = 0;
let username;

// 'Node' sınıfı, her bir bağlı liste öğesi için veri ve bir sonraki öğeye işaret eden bir işaretçi içerir.
class Node {
  constructor(data) {
    this.data = data; // veri parçası
    this.next = null; // sonraki öğeye işaret eden işaretçi
  }
}
class LinkedList {
  constructor() {
    this.head = null; // bağlı listenin başlangıç noktasını tutan başlangıç işaretçisi
    this.size = 0; // bağlı listenin öğe sayısı
  }

  // Yeni bir öğe eklemek için
  add(data) {
    const node = new Node(data); // yeni bir öğe oluşturulur
    let current;

    if (this.head == null) { // eğer bağlı liste boşsa, yeni öğe başlangıç noktasına atanır
      this.head = node;
    } else { // aksi halde son öğe bulunur ve yeni öğe sonraki öğe olarak atanır
      current = this.head;

      while (current.next) { // son öğe bulunana kadar tüm öğeler gezilir
        current = current.next;
      }

      current.next = node;
    }

    this.size++; // bağlı listenin öğe sayısı bir arttırılır
  }

  // Bir öğe silmek için
  remove(data) {
    let current = this.head; // öğeleri gezinmek için
    let prev = null; // önceki öğenin işaretçisi

    while (current != null) { // öğeler gezilir
      if (current.data === data) { // verilen öğe bulunduysa
        if (prev == null) { // eğer verilen öğe başlangıç noktasındaysa, başlangıç noktası güncellenir
          this.head = current.next;
        } else { // aksi halde, önceki öğenin işaretçisi yeni öğeye yönlendirilir
          prev.next = current.next;
        }
        this.size--; // bağlı listenin öğe sayısı bir azaltılır
        return current.data; // silinen öğenin verisi döndürülür
      }
      prev = current;
      current = current.next; // sonraki öğeye geçilir
    }
    return null; // eğer verilen öğe bulunamazsa 'null' döndürülür
  }

  printList() {
    let current = this.head;
    let list = "";

    while (current) {
      list += `(${current.data} => ${current.next ? current.next.data : "null"}) `;
      current = current.next;
    }

    console.log(list);
  }

  // Puzzle doğruluğunu bağlı listeler ile kontrol
  checkSolved() {
    let current = this.head;
    console.log(current);
    let correctList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    let puzzleList = [];
    let isSolved = false;

    while (current) {
      puzzleList.push(current.data);
      current = current.next;
    }

    let pieceCount = 0; // Doğru elemanların sayısını tutan değişken
    // Tüm elemanların doğru olup olmadığının kontrolü
    for (let i = 0; i < correctList.length; i++) {
      if (correctList[i] == puzzleList[i]) {
        pieceCount += 1;
      }
    }

    if (pieceCount == 16) {
      isSolved = true;
    }

    console.log(correctList);
    console.log(puzzleList);
    console.log(isSolved);
  }
}

// Bağlı listeye puzzle parçalarının eklenmesi
const ll = new LinkedList();
pieces.forEach((piece) => {
  ll.add(piece.innerHTML);
});

ll.printList();
ll.checkSolved();

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

    // Resmi yükleyin ve boyutlarını kontrol edin
    image.onload = () => {
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
    var content = `Kullanıcı adı: ${username}\nHamle Sayısı: ${count}`;
    download('enyuksekskor.txt', content);
  }
}

// Oyun bitiminde açılan pop-up
function openFullscreenAlert() {
  document.getElementById("fullscreen-alert").style.display = "block";
}

//Oyun bitiminde açılan ekranın kapatılması
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

//Dosya oluşturma ve yazma
function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
}