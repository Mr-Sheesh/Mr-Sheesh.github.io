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
        const buttons = document.querySelectorAll('button:not(#toggle-All-Buttons-Visibility)');
        buttons.forEach(button => {
            button.style.display = button.style.display === 'none' ? '' : 'none';
        });
    }

    // 非表示ボタンのイベントリスナー
    document.getElementById('toggle-All-Buttons-Visibility').addEventListener('click', toggleAllButtonsVisibility);
    
    // デフォルトで他のボタンを非表示にする
    function hideAllButtons() {
        const buttons = document.querySelectorAll('button:not(#toggle-All-Buttons-Visibility)');
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }

    /*// 設定データをインポートする関数
    function importSettingsFromScript(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
        // 既存の scheduleData を削除
        if (typeof scheduleData !== 'undefined') {
            delete window.scheduleData;
        }

        const importedScript = document.createElement('script');
        importedScript.textContent = e.target.result;
        document.body.appendChild(importedScript);

        if (typeof scheduleData !== 'undefined') {
            applySettings(scheduleData);
            alert('設定が手動でロードされました！');
        } else {
            throw new Error('scheduleData is not defined in the imported script.');
        }
        } catch (error) {
            alert('無効なスクリプトファイルです。');
            console.error('Error importing script:', error);
        }
    };
    reader.readAsText(file);*/
 
    // インポートボタンを作成
    /*const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.id = 'import-data';
    importInput.style.display = 'none';
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            importSettingsFromScript(file);
        }
    });

    const importButton = document.createElement('button');
    importButton.textContent = '設定をインポート';
    importButton.addEventListener('click', () => importInput.click());*/

    // ボタンをページに追加
    /*document.body.appendChild(importInput);
    document.body.appendChild(importButton);*/
    
    // エクスポートボタンを作成
    //const exportButton = document.createElement('button');

    // エクスポートボタンのイベントリスナー
    //document.getElementById('export-data').addEventListener('click', saveSettingsToScript);

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