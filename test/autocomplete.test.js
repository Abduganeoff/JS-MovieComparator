const waitFor = (selector) => {
    return new Promise( (resolve, reject) => {
         const interval = setInterval( () => {
            if(document.querySelector(selector)) {
                clearInterval(interval);
                clearTimeout(timeOut);
                resolve();
            }
        }, 30);

        const timeOut = setTimeout(() => {
            clearInterval(interval);
            reject();
        }, 2000);
    });
};

beforeEach(() => {
    document.querySelector('#target').innerHTML = '';
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                { Title: 'Avengers' },
                { Title: 'Not Avengers' },
                { Title: 'Some other movie' }
            ];
        },

        renderOption(movie) {
            return movie.Title;
        }
    });


});

it('Dropdown starts closed', () => {
   
    
    const dropdown = document.querySelector('.dropdown');

    assert.notInclude(dropdown.className, 'is-active');
});


it('After searching, dropdown opens up', async () => {
    const input = document.querySelector('input');
    input.value = 'avengers';
    input.dispatchEvent(new Event('input'));

    await waitFor('.dropdown-item');
    const dropdown = document.querySelector('.dropdown');
    assert.include(dropdown.className, 'is-active');
});

it('After searching, displays some results', async () => {
    const input = document.querySelector('input');
    input.value = 'avengers';
    input.dispatchEvent(new Event('input'));

    await waitFor('.dropdown-item');

    const items = document.querySelectorAll('.dropdown-item');
    assert.strictEqual(items.length, 3);

})