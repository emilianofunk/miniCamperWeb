<?PHP
$csv = array();
$lines = file('products.csv', FILE_IGNORE_NEW_LINES);

foreach ($lines as $key => $value) {
    $csv[$key] = str_getcsv($value);
}

echo ' <table style="width:100%">';
foreach ($csv as $value) {
  echo  '<tr>
    <td>' . $value[0] . '</td>
    <td>' . $value[1] . '</td>
    <td>' . $value[2] . '</td>
  </tr>';
}
echo '</table> ';

?>
