const pieces = document.querySelectorAll('.piece');
const fullPuzzle = document.querySelector('.full-puzzle');
var downloadDiv = document.querySelector('#download');
var countDiv = document.getElementById('count');
var countCongrat = document.getElementById('countCongrat');
var usernameInput = document.getElementById('username');
let firstClick = null;
var count = 0;
var score = 0;
var username;
var isFinish = false;

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
        pieces[puzzleList[i] - 1].classList.add("truePiece");
        pieceCount++;
        score = pieceCount *5;
        printCount();
      }
      else {
        pieces[puzzleList[i] - 1].classList.remove("truePiece");
      }
    }
    
    if (pieceCount == 16) {
      isSolved = true;
      downloadDiv.innerHTML = '1';
      console.log(downloadDiv);
      setTimeout(openFullscreenAlert, 300);
      var content = `Username: ${username}\nSwap: ${count}\nSkor: ${score}`;
      download('enyuksekskor.txt', content);
    }
  }

  //Hamle
  swapPieces(data1, data2) {
    // İlk elemanın işaretçisi bulunur
    let current1 = this.head;
    let prev1 = null;

    while (current1 != null && current1.data != data1) {
      prev1 = current1;
      current1 = current1.next;
    }

    // İkinci elemanın işaretçisi bulunur
    let current2 = this.head;
    let prev2 = null;

    while (current2 != null && current2.data != data2) {
      prev2 = current2;
      current2 = current2.next;
    }

    // Eğer verilen elemanlardan biri ya da ikisi de listede yoksa, işlem yapılmaz
    if (current1 == null || current2 == null) {
      return;
    }

    // İlk elemanın işaretçisi, ikinci elemanın işaretçisine yönlendirilir
    if (prev1 == null) {
      this.head = current2;
    } else {
      prev1.next = current2;
    }

    // İkinci elemanın işaretçisi, ilk elemanın işaretçisine yönlendirilir
    if (prev2 == null) {
      this.head = current1;
    } else {
      prev2.next = current1;
    }

    // Elemanların yerleri değiştirilir
    let temp = current1.next;
    current1.next = current2.next;
    current2.next = temp;
  }

}

//Bağlı listeye puzzle parçalarını ekleme
const ll = new LinkedList();
pieces.forEach((piece) => {
  ll.add(piece.id);
});

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

  pieces.forEach((piece) => {
    // Rastgele bir eleman seçin
    const randomIndex = Math.floor(Math.random() * indexes.length);
    const randomPieceIndex = indexes[randomIndex];

    // Seçilen elemanı diziden silin
    indexes.splice(randomIndex, 1);

    // Rastgele seçilen elemanın `pieces` dizisindeki parçayla yer değiştirmesi
    const randomPiece = pieces[randomPieceIndex];
    const firstPiece = pieces[piece.id - 1];
    pieces[randomPieceIndex] = firstPiece;
    pieces[piece.id - 1] = randomPiece;

    // Puzzle parçalarını bağlı listeye yerleştirme
    ll.swapPieces(firstPiece.id, randomPiece.id);

    // Rastgele atanan elemanlar id'sine göre yer değiştiriyor
    let firstPozX = piece.style.backgroundPositionX;
    piece.style.backgroundPositionX = randomPiece.style.backgroundPositionX;
    randomPiece.style.backgroundPositionX = firstPozX;
    let firstPozY = piece.style.backgroundPositionY;
    piece.style.backgroundPositionY = randomPiece.style.backgroundPositionY;
    randomPiece.style.backgroundPositionY = firstPozY;
  });
}


// Puzzle parçalarının hareket ettirilmesi
function swapPieces(piece) {
  if (firstClick === null) {
    // İlk tıklanan parçaya class ve parça atanması
    firstClick = piece;
    firstClick.classList.add("selected");
  } else {
    // 2.tıklanan parça ve yer değiştirme
    ll.swapPieces(firstClick.id, piece.id);
    // Parçaların konumlarını değiştirme
    let firstPozX = firstClick.style.backgroundPositionX;
    firstClick.style.backgroundPositionX = piece.style.backgroundPositionX;
    piece.style.backgroundPositionX = firstPozX;
    let firstPozY = firstClick.style.backgroundPositionY;
    firstClick.style.backgroundPositionY = piece.style.backgroundPositionY;
    piece.style.backgroundPositionY = firstPozY;
    
    // İlk tıklamayı resetleme
    firstClick.classList.remove("selected");
    firstClick = null;
    
    // Hamle sayısını arttırma ve yazdırma
    count++;
    printCount();
  }
  // Puzzle doğruluğunun kontrolü
  ll.checkSolved();
}

// Hamle sayısını yazdırma
function printCount() {
  countDiv.innerHTML = `Swap: ${count} <br> Score: ${score}`;
  countCongrat.innerHTML = `Swap: ${count} <br> Score: ${score}`;
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

function closeFullscreenAlert2() {
  location.reload();
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