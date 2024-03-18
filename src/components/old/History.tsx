import React from 'react';
import styled from 'styled-components';

function History() {
    return (
        <Section>
            <div className="orders">
                <div className="orders__details">
                    <div>
                        <h4>History</h4>
                    </div>
                    <div>
                        <h6>Transaction of last months</h6>
                    </div>
                </div>
                <div className="orders__table">
                    <table>
                        <tr>
                            <td>Car Insurance</td>
                            <td>14:10:32 AM</td>
                            <td>$350.00</td>
                            <td>Complete</td>
                        </tr>
                    </table>
                </div>
            </div>
        </Section>
    );
}

export default History;

const Section = styled.section`
    .orders {
        margin-top: 2rem; // Tighter top margin
        color: #333; // Darker font color for better readability
        width: 100%;

        .orders__details {
            display: flex;
            justify-content: space-between;
            margin: 1rem 1rem;
            align-items: center;

            h4 {
                color: #333; // Darker color for the heading
                font-size: 1.5rem; // Larger font size for the heading
            }

            h6 {
                color: #666; // Slightly lighter color for subheading
                font-size: 1rem; // Standard font size for subheading
                font-weight: normal; // Normal font weight for a more professional look
            }
        }

        .orders__table {
            margin: 1rem 0;
            color: #666; // Grey color for table text

            table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0 0.5rem; // Add space between rows

                td {
                    text-align: left; // Align text to the left for a more traditional table look
                    padding: 0.75rem 1rem;
                    background-color: #fff; // White background for each table cell
                    border-radius: 0.5rem; // Rounded corners for table cells
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Subtle shadow for depth

                    &:first-child {
                        text-align: left; // Align the first column to the left
                    }

                    &:last-child {
                        color: #4caf50; // Green color for the 'Complete' status
                        font-weight: bold; // Bold font weight for status
                    }
                }
            }
        }
    }
`;
