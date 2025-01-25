const languageConfig = {
    '.js': {
        name: 'JavaScript',
        extension: 'js',
        compile: null,
        run: {
            command: 'node',
            args: []
        }
    },
    '.py': {
        name: 'Python',
        extension: 'py',
        compile: null,
        run: {
            command: 'python3',
            args: []
        }
    },
    '.cpp': {
        name: 'C++',
        extension: 'cpp',
        compile: {
            command: 'g++',
            args: ['-std=c++17']
        },
        run: {
            command: './a.out',
            args: []
        }
    },
    '.java': {
        name: 'Java',
        extension: 'java',
        compile: {
            command: 'javac',
            args: []
        },
        run: {
            command: 'java',
            args: ['Solution']
        }
    }
};


function getLanguageFromExtension(ext) {
    return languageConfig[ext.toLowerCase()];
}

module.exports = {
    languageConfig,
    getLanguageFromExtension
};