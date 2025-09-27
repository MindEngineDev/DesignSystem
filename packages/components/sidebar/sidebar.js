      (() => {
        const drawer = document.querySelector('.drawer-placement-left');
        const openButton = drawer.nextElementSibling;
        openButton.addEventListener('click', () => drawer.show());
      })();