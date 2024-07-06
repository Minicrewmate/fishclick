document.addEventListener('DOMContentLoaded', () => {
    const fishButton = document.getElementById('fishButton');
    const sellButton = document.getElementById('sellButton');
    const shopButton = document.getElementById('shopButton');
    const backButtonShop = document.getElementById('backButtonShop');
    const rodsButton = document.getElementById('rodsButton');
    const backButtonRods = document.getElementById('backButtonRods');
    const fishCountText = document.getElementById('fishCountText');
    const salmonCountText = document.getElementById('salmonCountText');
    const codCountText = document.getElementById('codCountText');
    const moneyCountText = document.getElementById('moneyCountText');
    const cooldownMeter = document.getElementById('cooldownMeter');
    const menu = document.getElementById('menu');
    const shopMenu = document.getElementById('shopMenu');
    const rodsMenu = document.getElementById('rodsMenu');
    const currentRodText = document.getElementById('currentRodText');

    // Load saved game data from localStorage
    let fishCount = parseInt(localStorage.getItem('fishCount')) || 0;
    let salmonCount = parseInt(localStorage.getItem('salmonCount')) || 0;
    let codCount = parseInt(localStorage.getItem('codCount')) || 0;
    let money = parseInt(localStorage.getItem('money')) || 0;
    let isCooldown = false;
    let isShopMenuOpen = false;
    let isRodsMenuOpen = false;
    let rodType = localStorage.getItem('rodType') || 'wooden'; // 'wooden' または 'improved'
    let hasImprovedRod = localStorage.getItem('hasImprovedRod') === 'true'; // Improved Rod購入済みかどうか

    function updateDisplay() {
        fishCountText.textContent = fishCount;
        salmonCountText.textContent = salmonCount;
        codCountText.textContent = codCount;
        moneyCountText.textContent = money;

        // 表示/非表示の切り替え
        document.querySelector('#fishCount .fishItem:nth-of-type(1)').classList.toggle('hidden', fishCount === 0);
        document.querySelector('#fishCount .fishItem:nth-of-type(2)').classList.toggle('hidden', salmonCount === 0);
        document.querySelector('#fishCount .fishItem:nth-of-type(3)').classList.toggle('hidden', codCount === 0);
        document.querySelector('#fishCount .fishItem:nth-of-type(4)').classList.toggle('hidden', money === 0);

        // 装備中の竿を表示
        currentRodText.textContent = rodType === 'wooden' ? 'Wooden Rod' : 'Improved Rod';
    }

    function startCooldown() {
        if (isCooldown) return; // 既にクールダウン中なら終了
        
        isCooldown = true; // クールダウン中のフラグを設定
        fishButton.classList.add('disabled'); // ボタンを無効化

        // クールダウン時間を設定
        const cooldownDuration = rodType === 'wooden' ? 3000 : 1500; // 'wooden' 竿の場合は3秒、'improved' 竿の場合は1.5秒

        cooldownMeter.style.visibility = 'visible'; // クールダウンメーターを表示
        
        cooldownMeter.style.transition = 'none'; // トランジションを一時的に無効化
        cooldownMeter.style.transform = 'scaleX(1)'; // メーターをフルサイズで表示
    
        setTimeout(() => {
            cooldownMeter.style.transition = 'transform ' + cooldownDuration / 1000 + 's' + ' linear'; // トランジションを再適用
            console.log('transform ' + cooldownDuration / 1000 + 's' + ' linear')
            cooldownMeter.style.transform = 'scaleX(0)'; // メーターを非表示にする
        }, 0);
    
        setTimeout(() => {
            isCooldown = false; // クールダウンフラグをリセット
            fishButton.classList.remove('disabled'); // ボタンを有効化
    
            cooldownMeter.style.transition = 'none'; // トランジションを一時的に無効化
            cooldownMeter.style.visibility = 'hidden'; // メーターを非表示にする
            cooldownMeter.style.transform = 'scaleX(1)'; // メーターをフルサイズにリセット
    
            setTimeout(() => {
                cooldownMeter.style.transition = 'transform 3s linear'; // トランジションを再適用
            }, 0);
        }, cooldownDuration); // クールダウン時間に応じてリセット
    }

    function getFishingYield() {
        if (rodType === 'wooden') {
            return {
                fish: Math.floor(Math.random() * 3) + 1,
                salmon: Math.floor(Math.random() * 2),
                cod: Math.floor(Math.random() * 2)
            };
        } else if (rodType === 'improved') {
            return {
                fish: Math.floor(Math.random() * 4) + 2,
                salmon: Math.floor(Math.random() * 3) + 1,
                cod: Math.floor(Math.random() * 3)
            };
        }
    }

    function saveGameData() {
        localStorage.setItem('fishCount', fishCount);
        localStorage.setItem('salmonCount', salmonCount);
        localStorage.setItem('codCount', codCount);
        localStorage.setItem('money', money);
        localStorage.setItem('rodType', rodType);
        localStorage.setItem('hasImprovedRod', hasImprovedRod);
    }

    fishButton.addEventListener('click', () => {
        if (isCooldown) return;

        const { fish, salmon, cod } = getFishingYield();

        fishCount += fish;
        salmonCount += salmon;
        codCount += cod;

        updateDisplay();
        startCooldown();
        saveGameData(); // Save game data after fishing
    });

    sellButton.addEventListener('click', () => {
        const totalMoney = (fishCount * 10) + (salmonCount * 15) + (codCount * 20);
        money += totalMoney;

        fishCount = 0;
        salmonCount = 0;
        codCount = 0;

        updateDisplay();
        saveGameData(); // Save game data after selling
    });

    shopButton.addEventListener('click', () => {
        if (isShopMenuOpen) return; // クリック連打防止
        menu.style.transform = 'translateX(-100%)'; // メインメニューを隠す
        shopMenu.classList.add('show'); // ショップメニューを表示
        isShopMenuOpen = true;
    });

    backButtonShop.addEventListener('click', () => {
        shopMenu.classList.remove('show'); // ショップメニューを隠す
        menu.classList.add('show'); // メインメニューを表示
        isShopMenuOpen = false;
        isRodsMenuOpen = false;
        rodsMenu.classList.remove('show'); // Rodsメニューを隠す
    });

    rodsButton.addEventListener('click', () => {
        if (isRodsMenuOpen) return; // クリック連打防止
        shopMenu.classList.remove('show'); // ショップメニューを隠す
        rodsMenu.classList.add('show'); // Rodsメニューを表示
        isRodsMenuOpen = true;
    });

    backButtonRods.addEventListener('click', () => {
        rodsMenu.classList.remove('show'); // Rodsメニューを隠す
        shopMenu.classList.add('show'); // ショップメニューを表示
        isRodsMenuOpen = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (event.clientX > window.innerWidth - 270 && !isShopMenuOpen && !isRodsMenuOpen) {
            menu.classList.add('show'); // カーソルが右端に近づくとメニューを表示
        } else if (event.clientX <= window.innerWidth - 10 && !isShopMenuOpen && !isRodsMenuOpen) {
            menu.classList.remove('show'); // カーソルが離れるとメニューを隠す
        }
    });

    // Improved Rodを購入する機能
    document.getElementById('improvedRodButton').addEventListener('click', () => {
        if (!hasImprovedRod && money >= 500) {
            money -= 500; // コストを引く
            hasImprovedRod = true; // Improved Rodを購入済みに設定
            rodType = 'improved'; // Improved Rodを装備
            updateDisplay();
            saveGameData(); // Save game data after purchasing Improved Rod
        } else if (hasImprovedRod) {
            rodType = 'improved';
            updateDisplay();
            saveGameData();
        } else {
            alert('お金が足りません。');
        }
    });

    // Wooden Rodに切り替える機能
    document.getElementById('woodenRodButton').addEventListener('click', () => {
        rodType = 'wooden'; // Wooden Rodを装備
        updateDisplay();
        saveGameData(); // Save game data after switching to Wooden Rod
    });

    updateDisplay();
});
