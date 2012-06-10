{
  'targets': [
    {
      'target_name': 'binding',
      'sources': [
        'src/binding.cc'
      ],
      'include_dirs': ['/usr/include/postgresql'],
      'conditions': [
        [
          'OS=="linux"', {
            'libraries' : ['-lpq']
          }
        ]
      ]
    }
  ]
}
