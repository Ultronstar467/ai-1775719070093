document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const operatorSelect = document.getElementById('operator');
    const num2Input = document.getElementById('num2');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSpan = document.getElementById('result');
    const errorParagraph = document.getElementById('error');

    calculateBtn.addEventListener('click', async () => {
        // Clear previous results/errors
        resultSpan.textContent = '';
        errorParagraph.textContent = '';

        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operator = operatorSelect.value;

        // Basic client-side validation
        if (isNaN(num1) || isNaN(num2)) {
            errorParagraph.textContent = 'Please enter valid numbers for both fields.';
            return;
        }

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ num1, num2, operator }),
            });

            // Check if the response was successful (status code 200-299)
            if (!response.ok) {
                // If not successful, try to read error message from backend
                const errorData = await response.json();
                throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                errorParagraph.textContent = `Error: ${data.error}`;
            } else {
                resultSpan.textContent = data.result;
            }
        } catch (error) {
            // Handle network errors or other unexpected issues
            console.error('Fetch error:', error);
            errorParagraph.textContent = `An unexpected error occurred: ${error.message}`;
        }
    });
});