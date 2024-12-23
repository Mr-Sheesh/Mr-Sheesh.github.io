document.addEventListener('DOMContentLoaded', () => {
    const settingsFilePath = './schedule_data.js'; // デフォルト設定ファイルのパス

    // ローカルストレージにデータを保存
    function saveToLocalStorage(data) {
        localStorage.setItem('scheduleData', JSON.stringify(data));
        alert('設定がローカルストレージに保存されました！');
    }

    // ローカルストレージからデータを取得
    function loadFromLocalStorage() {
        const data = localStorage.getItem('scheduleData');
        if (data) {
            return JSON.parse(data);
        }
        return null; // データがない場合
    }

// 設定を適用する関数
function applySettings(data) {
    document.querySelectorAll('td').forEach((td, index) => {
        const link = td.querySelector('.course-link');
        const content = td.querySelector('.content');
        if (data[index]) {
            if (link) {
                link.textContent = data[index].name || "授業名";
                link.href = data[index].url || "#";
                link.target = '_blank'; // 新しいウィンドウで開くように設定
            }
            if (content) {
                if (data[index].visible) {
                    content.classList.remove('hidden');
                    td.style.backgroundColor = '#dff0d8'; // 表示状態に色をつける
                } else {
                    content.classList.add('hidden');
                    td.style.backgroundColor = ''; // 背景色をリセット
                }
            }
        }
    });
}

// 手動操作用のトグル機能
document.querySelectorAll('.toggle-visibility').forEach(button => {
    button.addEventListener('click', () => {
        const cell = button.closest('td');
        const content = cell.querySelector('.content');
        if (content) {
            content.classList.toggle('hidden');
            if (!content.classList.contains('hidden')) {
                cell.style.backgroundColor = '#dff0d8'; // 表示状態に色をつける
            } else {
                cell.style.backgroundColor = ''; // 背景色をリセット
            }
        }
    });
});


    document.querySelectorAll('.edit-name').forEach(button => {
        button.addEventListener('click', () => {
            const cell = button.parentElement;
            const link = cell.querySelector('.course-link');
            const currentName = link ? link.textContent : "";
            const newName = prompt('新しい授業名を入力してください:', currentName);
            if (newName && link) {
                link.textContent = newName;
            }
        });
    });

    document.querySelectorAll('.edit-url').forEach(button => {
        button.addEventListener('click', () => {
            const cell = button.parentElement;
            const link = cell.querySelector('.course-link');
            const currentURL = link ? link.href : "";
            const newURL = prompt('新しいURLを入力してください:', currentURL);
            if (newURL && link) {
                link.href = newURL;
            }
        });
    });

    // 設定を保存するボタンの処理
    document.getElementById('save-data').addEventListener('click', () => {
        const data = [];
        document.querySelectorAll('td').forEach(td => {
            const link = td.querySelector('.course-link');
            const content = td.querySelector('.content');
            data.push({
                name: link ? link.textContent : "",
                url: link ? link.href : "",
                visible: content ? !content.classList.contains('hidden') : false
            });
        });
        saveToLocalStorage(data); // ローカルストレージに保存
    });
    
    // ボタンを非表示/表示にする関数
    function toggleAllButtonsVisibility() {
        const buttons = document.querySelectorAll('button:not(#toggle-All-Buttons-Visibility):not(#save-data):not(#export-data)');
        buttons.forEach(button => {
            button.style.display = button.style.display === 'none' ? '' : 'none';
        });
    }

    // 非表示ボタンのイベントリスナー
    document.getElementById('toggle-All-Buttons-Visibility').addEventListener('click', toggleAllButtonsVisibility);
    
    // デフォルトで他のボタンを非表示にする
    function hideAllButtons() {
        const buttons = document.querySelectorAll('button:not(#toggle-All-Buttons-Visibility):not(#save-data):not(#export-data)');
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }

    // 設定ファイルをインポート
    function importSettingsFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const scriptContent = e.target.result;
                const scheduleDataMatch = scriptContent.match(/const scheduleData = (\[.*\]);/s);
                if (scheduleDataMatch && scheduleDataMatch[1]) {
                    const importedData = JSON.parse(scheduleDataMatch[1]);
                    saveToLocalStorage(importedData);
                    applySettings(importedData);
                    alert('設定がインポートされました！');
                } else {
                    throw new Error('インポートされたデータが不正です。');
                }
            } catch (error) {
                alert('無効なファイル形式です。正しいJavaScript形式のファイルを選択してください。');
                console.error('Error importing settings:', error);
            }
        };
        reader.readAsText(file);
    }

    // インポートボタンを作成
    const importButton = document.createElement('input');
    importButton.type = 'file';
    importButton.id = 'import-data';
    importButton.style.display = 'none';

    // 設定をローカルファイルからインポートするボタンの処理
    document.getElementById('import-data').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            importSettingsFromFile(file);
            event.target.value = ''; // ファイル名をリセット
        }
    });

    // 設定データをローカルに保存する関数
    function saveSettingsToScript() {
        const data = [];
        document.querySelectorAll('td').forEach(td => {
            const link = td.querySelector('.course-link');
            const content = td.querySelector('.content');
            data.push({
                name: link ? link.textContent : "",
                url: link ? link.href : "",
                visible: content ? !content.classList.contains('hidden') : false
            });
        });
        const scriptContent = `// schedule_data.js\nconst scheduleData = ${JSON.stringify(data, null, 2)};`;
        const blob = new Blob([scriptContent], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'schedule_data.js';
        a.click();
    }
    
    // エクスポートボタンを作成
    const exportButton = document.createElement('button');

    // エクスポートボタンのイベントリスナー
    document.getElementById('export-data').addEventListener('click', saveSettingsToScript);

    // 初期化処理
    hideAllButtons(); // デフォルトで他のボタンを非表示に

    // 初期化処理2
    function initialize() {
        const localData = loadFromLocalStorage();
        if (localData) {
            applySettings(localData); // ローカルストレージからデータを適用
            alert('ローカルストレージから設定をロードしました！');
        } else {
            loadSettingsFromScript(settingsFilePath); // デフォルト設定をロード
        }
    }

    // 初期化実行
    initialize();
});