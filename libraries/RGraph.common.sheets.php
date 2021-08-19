<?php
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o
    
    // Version 1.03

    class RGraph_Sheets
    {
        // The key of the spreadsheet
        public $key;

        // The data of the spreadsheet
        public $data;

        // Your OAuth ID
        public $oauth;

        // The worksheet ID
        public $worksheet = 'Sheet1';

        // Used for the columnn names.
        public $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // The URL of the sheet
        public $url = 'https://sheets.googleapis.com/v4/spreadsheets/[KEY]/values/[WORKSHEET]?alt=json&key=[OAUTH_KEY]';




        //
        // The constructor that creates the object
        //
        // @param string $key The identifier of the spreadsheet. You can get this
        //                    out of the URL for the spreadsheetsheet.
        //
        public function __construct ($oauth, $key = '', $worksheet = 'Sheet1')
        {
            $this->oauth     = $oauth;
            $this->key       = $key;
            $this->worksheet = $worksheet;

            // Do this if the key is a file: URL
            if (substr($this->oauth, 0, 5) === 'file:') {
                $filename = substr($this->oauth, 5);
                $this->json_raw = file_get_contents($filename);

            } else {
                // Add the key and worksheet ID into the URL
                $this->url = preg_replace('/\[OAUTH_KEY\]/', $this->oauth, $this->url);
                $this->url = preg_replace('/\[KEY\]/', $this->key, $this->url);
                $this->url = preg_replace('/\[WORKSHEET\]/', urlencode($this->worksheet), $this->url);

                // Fetch the sheet
                $this->json_raw = file_get_contents($this->url);
            }

            // Get rid of comments
            //$this->json = trim(preg_replace('|// API callback|m','',$this->json_raw));

            // Get rid of the JSONP function call
            //$this->json = preg_replace('/^__callback__\(/','',$this->json);
            //$this->json = preg_replace('/\);$/','',$this->json);

            // Convert the JSON into a PHP object
            $this->json = json_decode($this->json_raw);


            // Pull the data out of the json variable
            $grid = [];
            $row  = 0;
            $col  = 0;

            for ($row=0; $row<count($this->json->values); ++$row) { // Loop thru each row
                for ($col=0;$col<count($this->json->values[$row]); $col++) {
                    $grid[$row][$col] = $this->json->values[$row][$col];
                }
            }

            //
            // Determine the longest row
            //
            $maxcols = 0; // The max length of the rows
            
            for ($i=0; $i<count($grid); ++$i) {
                $maxcols = $grid[$i] ? max($maxcols, count($grid[$i]) ) : $maxcols;
            }


            //
            // Go through the array and fill in any blank holes.
            //
            for ($i=0; $i<count($grid); ++$i) {
                
                if (!$grid[$i]) {
                    $grid[$i] = array();
                    
                    // TODO Might need to add a loop setting the $maxcols number of
                    // array elements to a blank string.
                }

                for ($j=0; $j<$maxcols; $j++) {
                    if (empty($grid[$i][$j])) {
                        $grid[$i][$j] = '';
                    }
                    
                    ksort($grid[$i]);
                    
                    // Convert numbers to real numbers and floats here too
                    if (is_numeric($grid[$i][$j])) {
                        $grid[$i][$j] = (float)$grid[$i][$j];
                    }
                }
            }

            $this->numcols = $maxcols;
            $this->numrows = count($grid);
            $this->data    = $grid;
            ksort($this->data);
        }








        //
        // Fetches a row of data and returns it
        //
        // @param $index number The numeric index of the row to fetch (starts at 1)
        // @param $start number The number of columns that should be fetched
        // @param $opt          An option array containing options (optional)
        //
        public function row ($index, $start = 1)
        {
            $index = (int)$index;
            $start = (int)$start;
            
            if ($index === 0) {
                $index = 1;
                // 08/12/2020
                // Removed due to PHP 8 upgrade
                //
                //trigger_error('The row number given was zero - however row numbers begin at 1');
            }
            
            if ($this->data[$index - 1]) {
                $row = array_slice($this->data[$index - 1], $start - 1);
                return $row;
            } else {
                return [];
            }
        }







        //
        // Fetches a column of data and returns it
        //
        // @param $index number The letter that pertains to the column to fetch
        // @param $start number The number of rows that should be fetched
        // @param $opt          An option array containing options (optional)
        //
        public function col ($index, $start = 1)
        {

            for ($i=0,$col=[]; $i<count($this->data); ++$i) {
                $col[] = $this->data[$i][$index - 1];
            }

            // Now account for the start index
            $col = array_slice($col, $start - 1);

            return $col;
        }








        //
        // Returns the index (zero index) of the given letters
        //
        public function getIndexOfLetter  ($letter)
        {
            $letter = strtoupper($letter);

            if (strlen($letter) > 1) {            
                $parts = array_slice(preg_split('//', trim($letter)), 1, -1);
            } else {
                $parts = array($letter);
            }

            // Two letters are possible ie A -> ZZ
            if (count($parts) === 1) {
                return strpos($this->letters, $letter) + 1;
            
            } else if (count($parts) === 2){

                $idx =   ((strpos($this->letters, $parts[0]) + 1) * 26)
                       + (strpos($this->letters, $parts[1]) + 1);

                return $idx;
            }
        }








        //
        // The get() method makes retrieving cells very straightforward,
        // for example: obj.get('B1');
        //
        // @param str string The cells(s) to fetch
        // @param     string Optional set of options that are passed
        //                   to the relevant row/col function
        //
        function get ($str, $opt = [])
        {
            // Uppercase letters please!
            $str = strtoupper(trim($str));
            $ret = []; // This is the array that gets returned

            //
            // Handle the style of get('C') or get('AA'
            //
            if (preg_match('/^[A-Z]+$/', $str)) {
                if (strlen($str) === 1) {
                    $index = strpos($this->letters, $str) + 1;
                    $ret = $this->col($index, 1, $opt);
                
                } else if (strlen($str) === 2) {

                    $index = ((strpos($This->letters, $str[0]) + 1) * 26) + strpos($this->letters, $str[1]) + 1;
                    $ret = $this->col($index, 1, $opt);
                }
            }




            //
            // Handle the style of get('2');
            //(fetching a whole row
            //
            if (preg_match('/^[0-9]+$/i', $str)) {
                $ret = $this->row($str, 1, $opt);
            }




            //
            // Handle the style of get('E2');
            //(fetching a single cell)
            //
            if (preg_match('/^([a-z]{1,2})([0-9]+)$/i', $str, $matches)) {
                
                $letter = $matches[1];
                $number = (int)$matches[2];
                $col    = $this->get($letter);

                $ret = $col[$number - 1];
            }




            //
            // Handle the style of .get('B2:E2');
            //(fetching the B2 cell to the E2 cell)
            //
            if (preg_match('/^([a-z]{1,2})([0-9]+)\s*:\s*([a-z]{1,2})([0-9]+)$/i', $str, $matches)) {

                $letter1 = $matches[1];
                $number1 = $matches[2];
                $letter2 = $matches[3];
                $number2 = $matches[4];

                // A column
                if ($letter1 === $letter2) {
                    $cells = [];
                    $index = $this->getIndexOfLetter($letter1);

                    $col = $this->col($index, 1, $opt);

                    for ($i=($number1 - 1); $i<$number2; ++$i) {
                        $cells[] = !empty($col[$i]) ? $col[$i] : '';
                    }

                // A row
                } else if ($number1 === $number2) {

                    $cells  = [];
                    $row    = $this->row($number1, 1, $opt);
                    $index1 = $this->getIndexOfLetter($letter1);
                    $index2 = $this->getIndexOfLetter($letter2);

                    for ($i=($index1 - 1); $i<=($index2 - 1); ++$i) {
                        $cells[] = $row[$i];
                    }

                // A matrix
                } else if ($letter1 !== $letter2 AND $number1 !== $number2) {

                    $cells  = [];
                    $row    = [];
                    $index1 = $this->getIndexOfLetter($letter1);
                    $index2 = $this->getIndexOfLetter($letter2);

                    for ($i=$number1; $i<=$number2; ++$i) {
                        $row = $this->row($i);
                        $row = array_slice(
                            $row,
                            $index1 - 1,
                            $index2 - $index1 + 1
                        );
                        $cells[] = $row;
                    }
                }

                $ret = $cells;
            }
            
            // If the option has been specified then encode the array as a string
            if (!empty($opt['string'])) {
                $ret = json_encode($ret);
            }

            return $ret;
        }
    }
?>